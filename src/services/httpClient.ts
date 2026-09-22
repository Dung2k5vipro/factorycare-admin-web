import { LoiHttp, type PhanHoiApi } from "@/types/api";
import { layToken, xoaPhienDangNhap } from "./phienDangNhap";

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

export async function guiYeuCau<T>(
  duongDan: string,
  tuyChon: RequestInit = {},
  coXacThuc = true,
): Promise<T> {
  const token = layToken();
  const headers = new Headers(tuyChon.headers);
  headers.set("Content-Type", "application/json");

  if (coXacThuc && token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let phanHoi: Response;
  try {
    phanHoi = await fetch(`${DIA_CHI_API}${duongDan}`, {
      ...tuyChon,
      headers,
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
    if (phanHoi.status === 401 && token) {
      xoaPhienDangNhap();
      if (window.location.pathname !== "/dang-nhap") {
        window.location.replace("/dang-nhap?hetPhien=1");
      }
    }

    throw new LoiHttp(
      phanHoi.status,
      layThongBaoLoi(phanHoi.status, noiDung.thongBao),
    );
  }

  return noiDung.duLieu as T;
}

export async function guiYeuCauMultipart<T>(duongDan: string, duLieu: FormData, phuongThuc = "POST"): Promise<T> {
  const token = layToken();
  const headers = new Headers();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  let phanHoi: Response;
  try {
    phanHoi = await fetch(`${DIA_CHI_API}${duongDan}`, { method: phuongThuc, body: duLieu, headers, cache: "no-store" });
  } catch {
    throw new LoiHttp(0, "Không thể kết nối máy chủ. Vui lòng kiểm tra kết nối và thử lại.");
  }
  let noiDung: Partial<PhanHoiApi<T>> = {};
  try { noiDung = (await phanHoi.json()) as Partial<PhanHoiApi<T>>; } catch { noiDung = {}; }
  if (!phanHoi.ok || noiDung.thanhCong === false) {
    if (phanHoi.status === 401 && token) {
      xoaPhienDangNhap();
      if (window.location.pathname !== "/dang-nhap") window.location.replace("/dang-nhap?hetPhien=1");
    }
    throw new LoiHttp(phanHoi.status, layThongBaoLoi(phanHoi.status, noiDung.thongBao));
  }
  return noiDung.duLieu as T;
}
