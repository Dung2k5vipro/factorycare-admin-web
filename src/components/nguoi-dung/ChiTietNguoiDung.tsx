"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import {
  capNhatNguoiDung,
  capNhatTrangThaiNguoiDung,
  doiVaiTroNguoiDung,
  layChiTietNguoiDung,
} from "@/services/nguoiDung.service";
import { LoiHttp } from "@/types/api";
import { chiGiuChuSo } from "@/utils/duLieuNhap";
import { docTepAnhDaiDien, kiemTraTepAnhDaiDien } from "@/utils/kiemTraNguoiDung";
import type {
  DuLieuCapNhatNguoiDung,
  NguoiDung,
  TrangThaiNguoiDung,
  VaiTro,
} from "@/types/nguoiDung";
import { kiemTraEmail, kiemTraHoTen, kiemTraSoDienThoai, kiemTraVaiTro } from "@/utils/kiemTraNguoiDung";

interface ChiTietNguoiDungProps {
  idNguoiDung: number | null;
  dongChiTiet: () => void;
  khiCapNhat: (thongBao: string) => void;
}

type CheDo = "chiTiet" | "chinhSua" | "doiVaiTro";

const NHAN_VAI_TRO: Record<VaiTro, string> = {
  QUAN_TRI_VIEN: "Quản trị viên",
  KY_THUAT_VIEN: "Kỹ thuật viên",
  NHAN_VIEN: "Nhân viên",
};

const NHAN_TRANG_THAI: Record<TrangThaiNguoiDung, string> = {
  HOAT_DONG: "Hoạt động",
  NGUNG_HOAT_DONG: "Ngừng hoạt động",
};

function dinhDangNgay(giaTri?: string) {
  if (!giaTri) return "-";
  const ngay = new Date(giaTri);
  return Number.isNaN(ngay.getTime())
    ? "-"
    : new Intl.DateTimeFormat("vi-VN", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(ngay);
}

export default function ChiTietNguoiDung({
  idNguoiDung,
  dongChiTiet,
  khiCapNhat,
}: ChiTietNguoiDungProps) {
  const [nguoiDung, datNguoiDung] = useState<NguoiDung | null>(null);
  const [duLieuChinhSua, datDuLieuChinhSua] =
    useState<DuLieuCapNhatNguoiDung | null>(null);
  const [vaiTroMoi, datVaiTroMoi] = useState<VaiTro>("NHAN_VIEN");
  const [cheDo, datCheDo] = useState<CheDo>("chiTiet");
  const [dangTai, datDangTai] = useState(true);
  const [dangXuLy, datDangXuLy] = useState(false);
  const [dangXacNhanTrangThai, datDangXacNhanTrangThai] = useState(false);
  const [loi, datLoi] = useState<Record<string, string>>({});
  const [lanTaiLai, datLanTaiLai] = useState(0);
  const [tenTepAnh, datTenTepAnh] = useState("");

  useEffect(() => {
    if (idNguoiDung === null) return;
    let dangHoatDong = true;
    layChiTietNguoiDung(idNguoiDung)
      .then((ketQua) => {
        if (!dangHoatDong) return;
        datNguoiDung(ketQua);
        datDuLieuChinhSua({
          hoTen: ketQua.hoTen,
          email: ketQua.email,
          soDienThoai: ketQua.soDienThoai,
          anhDaiDien: ketQua.anhDaiDien,
          vaiTro: ketQua.vaiTro,
        });
        datVaiTroMoi(ketQua.vaiTro);
        datLoi({});
      })
      .catch((loiTai) => {
        if (dangHoatDong) {
          datLoi({ chung: (loiTai as LoiHttp).message });
        }
      })
      .finally(() => {
        if (dangHoatDong) datDangTai(false);
      });
    return () => {
      dangHoatDong = false;
    };
  }, [idNguoiDung, lanTaiLai]);

  if (idNguoiDung === null) return null;

  function taiLaiChiTiet() {
    datDangTai(true);
    datLoi({});
    datLanTaiLai((soLan) => soLan + 1);
  }

  function capNhatTruong(
    tenTruong: keyof DuLieuCapNhatNguoiDung,
    giaTri: string,
  ) {
    datDuLieuChinhSua((duLieuCu) =>
      duLieuCu ? { ...duLieuCu, [tenTruong]: giaTri } : duLieuCu,
    );
    datLoi((loiCu) => ({ ...loiCu, [tenTruong]: "", chung: "" }));
  }

  async function xuLyChonAnh(suKien: ChangeEvent<HTMLInputElement>) {
    const tepAnh = suKien.target.files?.[0] ?? null;
    const loiTepAnh = kiemTraTepAnhDaiDien(tepAnh);
    if (loiTepAnh) {
      datLoi((loiCu) => ({ ...loiCu, anhDaiDien: loiTepAnh }));
      datTenTepAnh("");
      return;
    }
    if (!tepAnh) return;
    try {
      const noiDungAnh = await docTepAnhDaiDien(tepAnh);
      datTenTepAnh(tepAnh.name);
      capNhatTruong("anhDaiDien", noiDungAnh);
    } catch {
      datLoi((loiCu) => ({ ...loiCu, anhDaiDien: "Không thể đọc tệp ảnh." }));
    }
  }

  function kiemTraDuLieu() {
    if (!duLieuChinhSua) return false;
    const loiMoi: Record<string, string> = {};
    const loiHoTenMoi = kiemTraHoTen(duLieuChinhSua.hoTen);
    const loiEmailMoi = kiemTraEmail(duLieuChinhSua.email);
    const loiSoDienThoaiMoi = kiemTraSoDienThoai(duLieuChinhSua.soDienThoai ?? "");
    if (loiHoTenMoi) loiMoi.hoTen = loiHoTenMoi;
    if (loiEmailMoi) loiMoi.email = loiEmailMoi;
    if (loiSoDienThoaiMoi) loiMoi.soDienThoai = loiSoDienThoaiMoi;
    if (!kiemTraVaiTro(duLieuChinhSua.vaiTro)) loiMoi.vaiTro = "Vai trò không hợp lệ.";
    if (!duLieuChinhSua.hoTen.trim()) loiMoi.hoTen = "Vui lòng nhập họ tên.";
    if (!duLieuChinhSua.email.trim()) loiMoi.email = "Vui lòng nhập email.";
    else if (!/^\S+@\S+\.\S+$/.test(duLieuChinhSua.email)) {
      loiMoi.email = "Email chưa đúng định dạng.";
    }
    datLoi(loiMoi);
    return Object.keys(loiMoi).length === 0;
  }

  async function xuLyCapNhat(suKien: FormEvent<HTMLFormElement>) {
    suKien.preventDefault();
    if (!nguoiDung || !duLieuChinhSua || !kiemTraDuLieu()) return;
    datDangXuLy(true);
    try {
      await capNhatNguoiDung(nguoiDung.id, {
        ...duLieuChinhSua,
        hoTen: duLieuChinhSua.hoTen.trim(),
        email: duLieuChinhSua.email.trim(),
        soDienThoai: duLieuChinhSua.soDienThoai?.trim() || null,
        anhDaiDien: duLieuChinhSua.anhDaiDien?.trim() || null,
      });
      datCheDo("chiTiet");
      khiCapNhat("Cập nhật thành công.");
      taiLaiChiTiet();
    } catch (loiGui) {
      const loiHttp = loiGui as LoiHttp;
      datLoi({
        [loiHttp.maTrangThai === 409 ? "email" : "chung"]:
          loiHttp.maTrangThai === 409
            ? "Email đã được sử dụng."
            : loiHttp.message,
      });
    } finally {
      datDangXuLy(false);
    }
  }

  async function xuLyDoiVaiTro(suKien: FormEvent<HTMLFormElement>) {
    suKien.preventDefault();
    if (!nguoiDung || !kiemTraVaiTro(vaiTroMoi) || vaiTroMoi === nguoiDung.vaiTro) {
      datLoi({ chung: "Vai trò không hợp lệ." });
      return;
    }
    datDangXuLy(true);
    datLoi({});
    try {
      await doiVaiTroNguoiDung(nguoiDung, vaiTroMoi);
      datCheDo("chiTiet");
      khiCapNhat("Đổi vai trò thành công.");
      taiLaiChiTiet();
    } catch (loiGui) {
      datLoi({ chung: (loiGui as LoiHttp).message });
    } finally {
      datDangXuLy(false);
    }
  }

  async function xuLyCapNhatTrangThai() {
    if (!nguoiDung) return;
    if (nguoiDung.trangThai !== "HOAT_DONG" && nguoiDung.trangThai !== "NGUNG_HOAT_DONG") {
      datLoi({ chung: "Trạng thái không hợp lệ." });
      datDangXacNhanTrangThai(false);
      return;
    }
    const trangThaiMoi: TrangThaiNguoiDung =
      nguoiDung.trangThai === "HOAT_DONG"
        ? "NGUNG_HOAT_DONG"
        : "HOAT_DONG";
    datDangXuLy(true);
    datLoi({});
    try {
      await capNhatTrangThaiNguoiDung(nguoiDung.id, trangThaiMoi);
      datDangXacNhanTrangThai(false);
      khiCapNhat(
        trangThaiMoi === "HOAT_DONG"
          ? "Tài khoản đã được khôi phục."
          : "Tài khoản đã được ngừng hoạt động.",
      );
      taiLaiChiTiet();
    } catch (loiGui) {
      datDangXacNhanTrangThai(false);
      datLoi({ chung: (loiGui as LoiHttp).message });
    } finally {
      datDangXuLy(false);
    }
  }

  function moChinhSua() {
    if (!nguoiDung) return;
    datDuLieuChinhSua({
      hoTen: nguoiDung.hoTen,
      email: nguoiDung.email,
      soDienThoai: nguoiDung.soDienThoai,
      anhDaiDien: nguoiDung.anhDaiDien,
      vaiTro: nguoiDung.vaiTro,
    });
    datLoi({});
    datCheDo("chinhSua");
  }

  function xuLyDong() {
    if (dangXuLy) return;
    dongChiTiet();
  }

  return (
    <div
      className="lop-phu"
      role="presentation"
      onMouseDown={(suKien) =>
        suKien.target === suKien.currentTarget && xuLyDong()
      }
    >
      <section
        className="hop-thoai hop-thoai-chi-tiet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tieu-de-chi-tiet"
      >
        <header className="dau-hop-thoai">
          <h2 id="tieu-de-chi-tiet">
            {cheDo === "chinhSua"
              ? "Sửa người dùng"
              : cheDo === "doiVaiTro"
                ? "Đổi vai trò"
                : "Chi tiết người dùng"}
          </h2>
          <button
            className="nut-dong"
            type="button"
            onClick={xuLyDong}
            aria-label="Đóng"
          >
            ×
          </button>
        </header>

        {dangTai ? (
          <div className="trang-thai-du-lieu">
            <span className="vong-xoay" /> Đang tải...
          </div>
        ) : !nguoiDung ? (
          <div className="trang-thai-du-lieu">
            <p>{loi.chung || "Không tìm thấy người dùng."}</p>
            <button className="nut nut-phu" onClick={taiLaiChiTiet}>
              Thử lại
            </button>
          </div>
        ) : cheDo === "chinhSua" && duLieuChinhSua ? (
          <form onSubmit={xuLyCapNhat} className="bieu-mau bieu-mau-them">
            {loi.chung && <div className="thong-bao loi">{loi.chung}</div>}
            <div className="luoi-hai-cot">
              <div className="nhom-truong">
                <label htmlFor="ho-ten-sua">Họ tên <em>*</em></label>
                <input id="ho-ten-sua" value={duLieuChinhSua.hoTen} onChange={(suKien) => capNhatTruong("hoTen", suKien.target.value)} disabled={dangXuLy} />
                {loi.hoTen && <span className="loi-truong">{loi.hoTen}</span>}
              </div>
              <div className="nhom-truong">
                <label htmlFor="email-sua">Email <em>*</em></label>
                <input id="email-sua" type="email" value={duLieuChinhSua.email} onChange={(suKien) => capNhatTruong("email", suKien.target.value)} disabled={dangXuLy} />
                {loi.email && <span className="loi-truong">{loi.email}</span>}
              </div>
              <div className="nhom-truong">
                <label htmlFor="so-dien-thoai-sua">Số điện thoại</label>
                <input id="so-dien-thoai-sua" type="tel" inputMode="numeric" pattern="[0-9]*" maxLength={10} value={duLieuChinhSua.soDienThoai ?? ""} onChange={(suKien) => capNhatTruong("soDienThoai", chiGiuChuSo(suKien.target.value, 10))} disabled={dangXuLy} />
                {loi.soDienThoai && <span className="loi-truong">{loi.soDienThoai}</span>}
              </div>
              <div className="nhom-truong">
                <label htmlFor="anh-dai-dien-sua">Ảnh đại diện</label>
                <input id="anh-dai-dien-sua" type="file" accept="image/*" onChange={xuLyChonAnh} disabled={dangXuLy} />
                {(tenTepAnh || duLieuChinhSua.anhDaiDien) && <span className="ten-tep-anh">{tenTepAnh || "Đã có ảnh đại diện"}</span>}
                {loi.anhDaiDien && <span className="loi-truong">{loi.anhDaiDien}</span>}
              </div>
            </div>
            <footer className="chan-hop-thoai">
              <button className="nut nut-phu" type="button" onClick={() => datCheDo("chiTiet")} disabled={dangXuLy}>Hủy</button>
              <button className="nut nut-chinh" type="submit" disabled={dangXuLy}>{dangXuLy ? "Đang lưu..." : "Lưu"}</button>
            </footer>
          </form>
        ) : cheDo === "doiVaiTro" ? (
          <form onSubmit={xuLyDoiVaiTro} className="bieu-mau bieu-mau-them">
            {loi.chung && <div className="thong-bao loi">{loi.chung}</div>}
            <div className="nhom-truong">
              <label htmlFor="vai-tro-cap-nhat">Vai trò</label>
              <select id="vai-tro-cap-nhat" value={vaiTroMoi} onChange={(suKien) => datVaiTroMoi(suKien.target.value as VaiTro)} disabled={dangXuLy}>
                <option value="QUAN_TRI_VIEN">Quản trị viên</option>
                <option value="KY_THUAT_VIEN">Kỹ thuật viên</option>
                <option value="NHAN_VIEN">Nhân viên</option>
              </select>
            </div>
            <footer className="chan-hop-thoai">
              <button className="nut nut-phu" type="button" onClick={() => datCheDo("chiTiet")} disabled={dangXuLy}>Hủy</button>
              <button className="nut nut-chinh" type="submit" disabled={dangXuLy || vaiTroMoi === nguoiDung.vaiTro}>{dangXuLy ? "Đang lưu..." : "Lưu"}</button>
            </footer>
          </form>
        ) : (
          <div className="noi-dung-chi-tiet">
            {loi.chung && <div className="thong-bao loi">{loi.chung}</div>}
            <div className="danh-tinh-nguoi-dung">
              <span className="avatar avatar-lon">
                {nguoiDung.hoTen.slice(0, 1).toUpperCase()}
              </span>
              <div><strong>{nguoiDung.hoTen}</strong><span>{nguoiDung.email}</span></div>
            </div>
            <dl className="luoi-thong-tin">
              <div><dt>Số điện thoại</dt><dd>{nguoiDung.soDienThoai || "-"}</dd></div>
              <div><dt>Vai trò</dt><dd>{NHAN_VAI_TRO[nguoiDung.vaiTro]}</dd></div>
              <div><dt>Trạng thái</dt><dd><span className={`trang-thai ${nguoiDung.trangThai === "HOAT_DONG" ? "hoat-dong" : "ngung-hoat-dong"}`}><i />{NHAN_TRANG_THAI[nguoiDung.trangThai]}</span></dd></div>
              <div><dt>Ngày tạo</dt><dd>{dinhDangNgay(nguoiDung.ngayTao)}</dd></div>
              <div><dt>Ngày cập nhật</dt><dd>{dinhDangNgay(nguoiDung.ngayCapNhat)}</dd></div>
            </dl>
            <footer className="chan-chi-tiet">
              <button className="nut nut-phu" onClick={moChinhSua}>Sửa</button>
              <button className="nut nut-phu" onClick={() => { datVaiTroMoi(nguoiDung.vaiTro); datLoi({}); datCheDo("doiVaiTro"); }}>Đổi vai trò</button>
              <button className={`nut ${nguoiDung.trangThai === "HOAT_DONG" ? "nut-nguy-hiem" : "nut-khoi-phuc"}`} onClick={() => datDangXacNhanTrangThai(true)}>
                {nguoiDung.trangThai === "HOAT_DONG" ? "Ngừng hoạt động" : "Khôi phục"}
              </button>
            </footer>
          </div>
        )}
      </section>

      {dangXacNhanTrangThai && nguoiDung && (
        <div className="lop-phu lop-phu-xac-nhan">
          <section className="hop-xac-nhan" role="alertdialog" aria-modal="true">
            <h3>{nguoiDung.trangThai === "HOAT_DONG" ? "Ngừng hoạt động tài khoản?" : "Khôi phục tài khoản?"}</h3>
            <strong>{nguoiDung.hoTen}</strong>
            <p>{nguoiDung.trangThai === "HOAT_DONG" ? "Tài khoản sẽ không thể đăng nhập." : "Tài khoản sẽ có thể đăng nhập lại."}</p>
            <div className="hanh-dong-xac-nhan">
              <button className="nut nut-phu" onClick={() => datDangXacNhanTrangThai(false)} disabled={dangXuLy}>Hủy</button>
              <button className={`nut ${nguoiDung.trangThai === "HOAT_DONG" ? "nut-nguy-hiem" : "nut-khoi-phuc"}`} onClick={xuLyCapNhatTrangThai} disabled={dangXuLy}>{dangXuLy ? "Đang xử lý..." : "Xác nhận"}</button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
