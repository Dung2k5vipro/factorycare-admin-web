"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { themNguoiDung } from "@/services/nguoiDung.service";
import { LoiHttp } from "@/types/api";
import type { DuLieuThemNguoiDung } from "@/types/nguoiDung";
import { docTepAnhDaiDien, kiemTraEmail, kiemTraHoTen, kiemTraSoDienThoai, kiemTraTepAnhDaiDien, kiemTraVaiTro } from "@/utils/kiemTraNguoiDung";

interface ThemNguoiDungProps { dangMo: boolean; dongBieuMau: () => void; khiThemThanhCong: () => void; }

const DU_LIEU_BAN_DAU: DuLieuThemNguoiDung = { hoTen: "", email: "", matKhau: "", soDienThoai: "", anhDaiDien: null, vaiTro: "NHAN_VIEN" };

export default function ThemNguoiDung({ dangMo, dongBieuMau, khiThemThanhCong }: ThemNguoiDungProps) {
  const [duLieuNguoiDung, datDuLieuNguoiDung] = useState(DU_LIEU_BAN_DAU);
  const [loi, datLoi] = useState<Record<string, string>>({});
  const [dangXuLy, datDangXuLy] = useState(false);
  const [tenTepAnh, datTenTepAnh] = useState("");
  if (!dangMo) return null;

  function capNhatTruong(tenTruong: keyof DuLieuThemNguoiDung, giaTri: string) {
    datDuLieuNguoiDung((duLieuCu) => ({ ...duLieuCu, [tenTruong]: giaTri }));
    datLoi((loiCu) => ({ ...loiCu, [tenTruong]: "", chung: "" }));
  }

  function kiemTraDuLieuNguoiDung() {
    const loiMoi: Record<string, string> = {};
    const loiHoTen = kiemTraHoTen(duLieuNguoiDung.hoTen);
    const loiEmail = kiemTraEmail(duLieuNguoiDung.email);
    const loiSoDienThoai = kiemTraSoDienThoai(duLieuNguoiDung.soDienThoai ?? "");
    if (loiHoTen) loiMoi.hoTen = loiHoTen;
    if (loiEmail) loiMoi.email = loiEmail;
    if (!duLieuNguoiDung.matKhau) loiMoi.matKhau = "Mật khẩu không được để trống.";
    if (loiSoDienThoai) loiMoi.soDienThoai = loiSoDienThoai;
    if (!kiemTraVaiTro(duLieuNguoiDung.vaiTro)) loiMoi.vaiTro = "Vai trò không hợp lệ.";
    datLoi(loiMoi);
    return Object.keys(loiMoi).length === 0;
  }

  async function xuLyChonAnh(suKien: ChangeEvent<HTMLInputElement>) {
    const tepAnh = suKien.target.files?.[0] ?? null;
    const loiTepAnh = kiemTraTepAnhDaiDien(tepAnh);
    if (loiTepAnh) {
      datLoi((loiCu) => ({ ...loiCu, anhDaiDien: loiTepAnh }));
      datTenTepAnh("");
      datDuLieuNguoiDung((duLieuCu) => ({ ...duLieuCu, anhDaiDien: null }));
      return;
    }
    if (!tepAnh) {
      datTenTepAnh("");
      datDuLieuNguoiDung((duLieuCu) => ({ ...duLieuCu, anhDaiDien: null }));
      return;
    }
    try {
      const noiDungAnh = await docTepAnhDaiDien(tepAnh);
      datTenTepAnh(tepAnh.name);
      datDuLieuNguoiDung((duLieuCu) => ({ ...duLieuCu, anhDaiDien: noiDungAnh }));
      datLoi((loiCu) => ({ ...loiCu, anhDaiDien: "" }));
    } catch {
      datLoi((loiCu) => ({ ...loiCu, anhDaiDien: "Không thể đọc tệp ảnh." }));
    }
  }

  async function xuLyThemNguoiDung(suKien: FormEvent<HTMLFormElement>) {
    suKien.preventDefault();
    if (!kiemTraDuLieuNguoiDung()) return;
    datDangXuLy(true);
    try {
      const duLieuGui: DuLieuThemNguoiDung = { hoTen: duLieuNguoiDung.hoTen.trim(), email: duLieuNguoiDung.email.trim(), matKhau: duLieuNguoiDung.matKhau, vaiTro: duLieuNguoiDung.vaiTro };
      if (duLieuNguoiDung.soDienThoai?.trim()) duLieuGui.soDienThoai = duLieuNguoiDung.soDienThoai.trim();
      if (duLieuNguoiDung.anhDaiDien?.trim()) duLieuGui.anhDaiDien = duLieuNguoiDung.anhDaiDien.trim();
      await themNguoiDung(duLieuGui);
      datDuLieuNguoiDung(DU_LIEU_BAN_DAU);
      datTenTepAnh("");
      datLoi({});
      khiThemThanhCong();
    } catch (loiGui) {
      const loiHttp = loiGui as LoiHttp;
      datLoi({ [loiHttp.maTrangThai === 409 ? "email" : "chung"]: loiHttp.maTrangThai === 409 ? "Email đã được sử dụng." : loiHttp.message });
    } finally { datDangXuLy(false); }
  }

  function xuLyDong() {
    if (dangXuLy) return;
    datDuLieuNguoiDung(DU_LIEU_BAN_DAU);
    datTenTepAnh("");
    datLoi({});
    dongBieuMau();
  }

  return (
    <div className="lop-phu" role="presentation" onMouseDown={(suKien) => suKien.target === suKien.currentTarget && xuLyDong()}>
      <section className="hop-thoai" role="dialog" aria-modal="true" aria-labelledby="tieu-de-them">
        <header className="dau-hop-thoai"><h2 id="tieu-de-them">Thêm người dùng</h2><button className="nut-dong" type="button" onClick={xuLyDong} aria-label="Đóng">×</button></header>
        <form onSubmit={xuLyThemNguoiDung} className="bieu-mau bieu-mau-them">
          {loi.chung && <div className="thong-bao loi" role="alert">{loi.chung}</div>}
          <div className="luoi-hai-cot">
            <div className="nhom-truong"><label htmlFor="ho-ten">Họ tên <em>*</em></label><input id="ho-ten" value={duLieuNguoiDung.hoTen} onChange={(suKien) => capNhatTruong("hoTen", suKien.target.value)} disabled={dangXuLy} />{loi.hoTen && <span className="loi-truong">{loi.hoTen}</span>}</div>
            <div className="nhom-truong"><label htmlFor="email-moi">Email <em>*</em></label><input id="email-moi" type="email" value={duLieuNguoiDung.email} onChange={(suKien) => capNhatTruong("email", suKien.target.value)} disabled={dangXuLy} />{loi.email && <span className="loi-truong">{loi.email}</span>}</div>
            <div className="nhom-truong"><label htmlFor="mat-khau-moi">Mật khẩu <em>*</em></label><input id="mat-khau-moi" type="password" value={duLieuNguoiDung.matKhau} onChange={(suKien) => capNhatTruong("matKhau", suKien.target.value)} autoComplete="new-password" disabled={dangXuLy} />{loi.matKhau && <span className="loi-truong">{loi.matKhau}</span>}</div>
            <div className="nhom-truong"><label htmlFor="so-dien-thoai">Số điện thoại</label><input id="so-dien-thoai" type="tel" inputMode="numeric" maxLength={10} value={duLieuNguoiDung.soDienThoai ?? ""} onChange={(suKien) => capNhatTruong("soDienThoai", suKien.target.value)} disabled={dangXuLy} />{loi.soDienThoai && <span className="loi-truong">{loi.soDienThoai}</span>}</div>
            <div className="nhom-truong"><label htmlFor="vai-tro-moi">Vai trò <em>*</em></label><select id="vai-tro-moi" value={duLieuNguoiDung.vaiTro} onChange={(suKien) => capNhatTruong("vaiTro", suKien.target.value)} disabled={dangXuLy}><option value="NHAN_VIEN">Nhân viên</option><option value="KY_THUAT_VIEN">Kỹ thuật viên</option><option value="QUAN_TRI_VIEN">Quản trị viên</option></select>{loi.vaiTro && <span className="loi-truong">{loi.vaiTro}</span>}</div>
            <div className="nhom-truong"><label htmlFor="anh-dai-dien">Ảnh đại diện</label><input id="anh-dai-dien" type="file" accept="image/*" onChange={xuLyChonAnh} disabled={dangXuLy} />{tenTepAnh && <span className="ten-tep-anh">{tenTepAnh}</span>}{loi.anhDaiDien && <span className="loi-truong">{loi.anhDaiDien}</span>}</div>
          </div>
          <footer className="chan-hop-thoai"><button className="nut nut-phu" type="button" onClick={xuLyDong} disabled={dangXuLy}>Hủy</button><button className="nut nut-chinh" type="submit" disabled={dangXuLy}>{dangXuLy ? "Đang tạo..." : "Tạo người dùng"}</button></footer>
        </form>
      </section>
    </div>
  );
}
