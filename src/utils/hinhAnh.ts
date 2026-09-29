/**
 * Tiện ích xử lý và chuẩn hóa đường dẫn hình ảnh cho toàn bộ hệ thống
 */

/**
 * Lấy gốc máy chủ backend (mặc định http://localhost:3005)
 */
export function layGocMayChuBackend(): string {
  const diaChiApi = (
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:3005/api"
  ).trim();

  try {
    if (/^https?:\/\//i.test(diaChiApi)) {
      const url = new URL(diaChiApi);
      return url.origin;
    }
  } catch {
    // Không phân tích được thì dùng mặc định
  }

  return "http://localhost:3005";
}

/**
 * Tạo URL đầy đủ từ đường dẫn ảnh tương đối hoặc giữ nguyên nếu là URL hợp lệ.
 */
export function layDuongDanAnh(duongDan?: string | null): string | null {
  if (!duongDan || typeof duongDan !== "string") return null;

  // Chuẩn hóa dấu gạch chéo ngược (Windows path) sang gạch chéo xuôi
  const giaTri = duongDan.trim().replace(/\\/g, "/");
  if (!giaTri) return null;

  // Nếu là data URL hoặc blob URL thì trả về trực tiếp
  if (/^(data:|blob:)/i.test(giaTri)) {
    return giaTri;
  }

  const gocMayChu = layGocMayChuBackend();

  // Nếu là URL đầy đủ
  if (/^https?:\/\//i.test(giaTri)) {
    try {
      const urlObj = new URL(giaTri);
      // Nếu URL chứa đường dẫn tĩnh /uploads/ nhưng port bị sai (vd: 3000 hoặc IP cũ)
      if (urlObj.pathname.startsWith("/uploads/")) {
        return `${gocMayChu}${urlObj.pathname}`;
      }
      return giaTri;
    } catch {
      return giaTri;
    }
  }

  // Nếu là đường dẫn bắt đầu bằng // (protocol-relative)
  if (giaTri.startsWith("//")) {
    const giaoThuc = typeof window !== "undefined" && window.location?.protocol ? window.location.protocol : "http:";
    return `${giaoThuc}${giaTri}`;
  }

  const duongDanChuan = giaTri.startsWith("/") ? giaTri : `/${giaTri}`;
  return `${gocMayChu}${duongDanChuan}`;
}

/**
 * Chuẩn hóa dữ liệu hình ảnh (mảng chuỗi, chuỗi JSON, chuỗi đơn lẻ, đối tượng) thành mảng URL hợp lệ.
 */
export function chuanHoaDanhSachAnh(duLieuAnh: unknown): string[] {
  if (!duLieuAnh) return [];

  // Trường hợp mảng
  if (Array.isArray(duLieuAnh)) {
    const danhSach = duLieuAnh
      .flatMap((muc) => chuanHoaDanhSachAnh(muc))
      .filter((url): url is string => Boolean(url));
    return Array.from(new Set(danhSach));
  }

  // Trường hợp chuỗi
  if (typeof duLieuAnh === "string") {
    const chuoi = duLieuAnh.trim();
    if (!chuoi) return [];

    // Nếu chuỗi là JSON (mảng hoặc đối tượng)
    if (
      (chuoi.startsWith("[") && chuoi.endsWith("]")) ||
      (chuoi.startsWith("{") && chuoi.endsWith("}"))
    ) {
      try {
        const parsed = JSON.parse(chuoi);
        return chuanHoaDanhSachAnh(parsed);
      } catch {
        // Nếu parse lỗi, tiếp tục xử lý như chuỗi thông thường
      }
    }

    // Nếu chuỗi chứa nhiều ảnh phân tách bằng dấu phẩy
    if (chuoi.includes(",") && !chuoi.startsWith("data:")) {
      return chuoi
        .split(",")
        .map((phan) => layDuongDanAnh(phan.trim()))
        .filter((url): url is string => Boolean(url));
    }

    const url = layDuongDanAnh(chuoi);
    return url ? [url] : [];
  }

  // Trường hợp đối tượng có thuộc tính url/path/duongDan/hinhAnh...
  if (typeof duLieuAnh === "object" && duLieuAnh !== null) {
    const obj = duLieuAnh as Record<string, unknown>;
    const danhSach: string[] = [];
    for (const khoa of [
      "hinhAnhSuaChua",
      "hinh_anh_sua_chua",
      "anhQuaTrinh",
      "anh_qua_trinh",
      "anhSuaChua",
      "anh_sua_chua",
      "hinhAnh",
      "hinh_anh",
      "danhSachAnh",
      "url",
      "duongDan",
      "duongDanAnh",
      "path",
      "src",
      "uri",
      "images",
      "photos",
    ]) {
      if (obj[khoa] !== undefined && obj[khoa] !== null && obj[khoa] !== "") {
        danhSach.push(...chuanHoaDanhSachAnh(obj[khoa]));
      }
    }
    return Array.from(new Set(danhSach));
  }

  return [];
}

/**
 * Trích xuất toàn bộ ảnh từ một hồ sơ sửa chữa hoặc đối tượng tiến độ
 */
export function layTatCaAnhHoSo(hoSo?: unknown): string[] {
  if (!hoSo || typeof hoSo !== "object") return [];
  return chuanHoaDanhSachAnh(hoSo);
}

export interface KetQuaPhanTachAnh {
  anhQuaTrinh: string[];
  anhHoanThanh: string[];
}

/**
 * Phân tách ảnh quá trình xử lý và ảnh sau khi sửa chữa hoàn thành theo giai đoạn tải lên
 */
export function phanTachAnhHoSo(
  duLieuAnh: unknown,
  thoiGianHoanThanh?: string | null
): KetQuaPhanTachAnh {
  const danhSachAnh = chuanHoaDanhSachAnh(duLieuAnh);
  if (!danhSachAnh.length) {
    return { anhQuaTrinh: [], anhHoanThanh: [] };
  }

  // Nếu hồ sơ chưa hoàn thành -> tất cả ảnh hiện tại là ảnh quá trình xử lý
  if (!thoiGianHoanThanh) {
    return {
      anhQuaTrinh: danhSachAnh,
      anhHoanThanh: [],
    };
  }

  // Trích xuất timestamp từ tên file (ví dụ su_co_1790595406327_424171689.jpg)
  const danhSachCoTime = danhSachAnh.map((url) => {
    const match = url.match(/_(\d{10,13})_/);
    const ts = match ? Number(match[1]) : 0;
    return { url, ts };
  });

  // Gom các ảnh thành từng cụm upload (khoảng cách giữa các ảnh trong cùng 1 lần gửi <= 5000ms)
  const cacCum: Array<Array<{ url: string; ts: number }>> = [];
  let cumHienTai: Array<{ url: string; ts: number }> = [];

  danhSachCoTime.forEach((item) => {
    if (cumHienTai.length === 0) {
      cumHienTai.push(item);
    } else {
      const prev = cumHienTai[cumHienTai.length - 1];
      if (item.ts > 0 && prev.ts > 0 && Math.abs(item.ts - prev.ts) < 5000) {
        cumHienTai.push(item);
      } else {
        cacCum.push(cumHienTai);
        cumHienTai = [item];
      }
    }
  });
  if (cumHienTai.length > 0) {
    cacCum.push(cumHienTai);
  }

  // Nếu chỉ có 1 đợt upload và đã hoàn thành -> toàn bộ là ảnh sau khi sửa chữa hoàn thành
  if (cacCum.length <= 1) {
    return {
      anhQuaTrinh: [],
      anhHoanThanh: danhSachAnh,
    };
  }

  // Nếu có nhiều đợt upload: đợt cuối cùng là ảnh hoàn thành, các đợt trước là ảnh quá trình
  const cumCuoi = cacCum[cacCum.length - 1];
  const cacCumTruoc = cacCum.slice(0, cacCum.length - 1);

  return {
    anhQuaTrinh: cacCumTruoc.flatMap((c) => c.map((i) => i.url)),
    anhHoanThanh: cumCuoi.map((i) => i.url),
  };
}
