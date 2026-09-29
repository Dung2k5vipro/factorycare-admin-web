import { LoiHttp, type PhanHoiApi } from "@/types/api";
import { layToken as layMaXacThuc, xoaPhienDangNhap } from "./phienDangNhap";

const DIA_CHI_API =
  (process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL)?.replace(/\/$/, "") ??
  "http://localhost:3000/api";

function layThongBaoLoi(maTrangThai: number, thongBaoMayChu?: string) {
  if (maTrangThai === 401) return "Phiên đăng nhập không hợp lệ hoặc đã hết hạn.";
  if (maTrangThai === 403) return "Bạn không có quyền thực hiện thao tác này.";
  if (maTrangThai === 404) return "Không tìm thấy dữ liệu yêu cầu.";
  if (maTrangThai >= 500) return "Máy chủ đang gặp sự cố. Vui lòng thử lại sau.";

  const coThongTinKyThuat =
    !thongBaoMayChu ||
    /sql|stack|exception|typeerror|\/api\//i.test(thongBaoMayChu);

  if (!coThongTinKyThuat && thongBaoMayChu.length <= 180) {
    return thongBaoMayChu;
  }

  if (maTrangThai === 409) {
    return "Không thể thực hiện do xung đột dữ liệu.";
  }

  return "Dữ liệu chưa hợp lệ. Vui lòng kiểm tra và thử lại.";
}

function xuLyPhienHetHan(maTrangThai: number, maXacThuc: string | null) {
  if (maTrangThai !== 401 || !maXacThuc || typeof window === "undefined") return;
  xoaPhienDangNhap();
  if (window.location.pathname !== "/dang-nhap") {
    window.location.replace("/dang-nhap?hetPhien=1");
  }
}

export async function guiYeuCau<T>(
  duongDan: string,
  tuyChon: RequestInit = {},
  coXacThuc = true,
): Promise<T> {
  const maXacThuc = layMaXacThuc();
  const tapTieuDeYeuCau = new Headers(tuyChon.headers);
  tapTieuDeYeuCau.set("Content-Type", "application/json");

  if (coXacThuc && maXacThuc) {
    tapTieuDeYeuCau.set("Authorization", `Bearer ${maXacThuc}`);
  }

  let phanHoi: Response;
  try {
    phanHoi = await fetch(`${DIA_CHI_API}${duongDan}`, {
      ...tuyChon,
      headers: tapTieuDeYeuCau,
      cache: "no-store",
    });
  } catch {
    throw new LoiHttp(
      0,
      "Không thể kết nối máy chủ. Vui lòng kiểm tra kết nối và thử lại.",
    );
  }

  let noiDung: Partial<PhanHoiApi<T>> = {};
  try {
    noiDung = (await phanHoi.json()) as Partial<PhanHoiApi<T>>;
  } catch {
    noiDung = {};
  }

  if (!phanHoi.ok || noiDung.thanhCong === false) {
    xuLyPhienHetHan(phanHoi.status, maXacThuc);

    throw new LoiHttp(
      phanHoi.status,
      layThongBaoLoi(phanHoi.status, noiDung.thongBao),
    );
  }

  return noiDung.duLieu as T;
}

export async function guiYeuCauMultipart<T>(duongDan: string, duLieuBieuMau: FormData, phuongThuc = "POST"): Promise<T> {
  const maXacThuc = layMaXacThuc();
  const tapTieuDeYeuCau = new Headers();
  if (maXacThuc) tapTieuDeYeuCau.set("Authorization", `Bearer ${maXacThuc}`);
  let phanHoi: Response;
  try {
    phanHoi = await fetch(`${DIA_CHI_API}${duongDan}`, { method: phuongThuc, body: duLieuBieuMau, headers: tapTieuDeYeuCau, cache: "no-store" });
  } catch {
    throw new LoiHttp(0, "Không thể kết nối máy chủ. Vui lòng kiểm tra kết nối và thử lại.");
  }
  let noiDung: Partial<PhanHoiApi<T>> = {};
  try { noiDung = (await phanHoi.json()) as Partial<PhanHoiApi<T>>; } catch { noiDung = {}; }
  if (!phanHoi.ok || noiDung.thanhCong === false) {
    xuLyPhienHetHan(phanHoi.status, maXacThuc);
    throw new LoiHttp(phanHoi.status, layThongBaoLoi(phanHoi.status, noiDung.thongBao));
  }
  return noiDung.duLieu as T;
}

function layTenTep(phanHoi: Response) {
  const thongTinTepDinhKem = phanHoi.headers.get("Content-Disposition") || "";
  const tenMaHoa = thongTinTepDinhKem.match(/filename\*=UTF-8''([^;]+)/i)?.[1];
  if (tenMaHoa) {
    try {
      return decodeURIComponent(tenMaHoa.replace(/["']/g, ""));
    } catch {
      return tenMaHoa.replace(/["']/g, "");
    }
  }
  return thongTinTepDinhKem.match(/filename="?([^";]+)"?/i)?.[1] || "bao-cao";
}

export async function guiYeuCauTep(duongDan: string) {
  const maXacThuc = layMaXacThuc();
  const tapTieuDeYeuCau = new Headers();
  if (maXacThuc) tapTieuDeYeuCau.set("Authorization", `Bearer ${maXacThuc}`);

  let phanHoi: Response;
  try {
    phanHoi = await fetch(`${DIA_CHI_API}${duongDan}`, {
      method: "GET",
      headers: tapTieuDeYeuCau,
      cache: "no-store",
    });
  } catch {
    throw new LoiHttp(
      0,
      "Không thể kết nối máy chủ. Vui lòng kiểm tra kết nối và thử lại.",
    );
  }

  const tep = await phanHoi.blob();
  if (!phanHoi.ok) {
    xuLyPhienHetHan(phanHoi.status, maXacThuc);
    let thongBaoMayChu: string | undefined;
    try {
      const noiDung = JSON.parse(await tep.text()) as Partial<PhanHoiApi<never>>;
      thongBaoMayChu = noiDung.thongBao;
    } catch {
      thongBaoMayChu = undefined;
    }
    throw new LoiHttp(
      phanHoi.status,
      layThongBaoLoi(phanHoi.status, thongBaoMayChu),
    );
  }

  return { tep, tenTep: layTenTep(phanHoi) };
}
