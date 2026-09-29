"use client";

import { FormEvent, useEffect, useState } from "react";
import { capNhatMauChecklist, taoMauChecklist } from "@/services/baoTri.service";
import { layDanhSachLoaiThietBi, themLoaiThietBi } from "@/services/thietBi.service";
import type { MauChecklist } from "@/types/baoTri";
import { LoiHttp } from "@/types/api";
import type { LoaiThietBi } from "@/types/thietBi";
import { layTenLoi } from "@/utils/baoTri";

interface BieuMauChecklistProps {
  dangMo: boolean;
  mauChecklist?: MauChecklist | null;
  xuLyDongBieuMau: () => void;
  xuLyLuuThanhCong: (thongBao: string) => void;
}

interface HangMucNhap {
  khoa: number;
  id?: number | string;
  noiDung: string;
}

function taoHangMuc(khoa: number, noiDung = "", id?: number | string): HangMucNhap {
  return { khoa, id, noiDung };
}

export default function BieuMauChecklist({ dangMo, mauChecklist, xuLyDongBieuMau, xuLyLuuThanhCong }: BieuMauChecklistProps) {
  const [tenMau, datTenMau] = useState("");
  const [tenLoaiThietBi, datTenLoaiThietBi] = useState("");
  const [moTa, datMoTa] = useState("");
  const [danhSachHangMuc, datDanhSachHangMuc] = useState<HangMucNhap[]>([taoHangMuc(1)]);
  const [loi, datLoi] = useState<Record<string, string>>({});
  const [dangLuu, datDangLuu] = useState(false);

  useEffect(() => {
    if (!dangMo) return;
    datTenMau(mauChecklist?.tenMau || "");
    datTenLoaiThietBi(mauChecklist?.loaiThietBi?.tenLoai || "");
    datMoTa(mauChecklist?.moTa || "");
    datDanhSachHangMuc(mauChecklist?.danhSachHangMuc.length ? mauChecklist.danhSachHangMuc.map((hangMuc, viTri) => taoHangMuc(viTri + 1, hangMuc.noiDung || "", hangMuc.id)) : [taoHangMuc(1)]);
    datLoi({});
  }, [dangMo, mauChecklist]);

  if (!dangMo) return null;

  async function layHoacTaoLoaiThietBi(tenLoai: string): Promise<LoaiThietBi> {
    const ketQuaTimKiem = await layDanhSachLoaiThietBi({ trang: 1, gioiHan: 20, tuKhoa: tenLoai });
    const loaiDaTonTai = ketQuaTimKiem.danhSach.find((loaiThietBi) => loaiThietBi.tenLoai.trim().toLocaleLowerCase("vi-VN") === tenLoai.toLocaleLowerCase("vi-VN"));
    if (loaiDaTonTai) return loaiDaTonTai;
    try {
      return await themLoaiThietBi({ tenLoai });
    } catch (loiTao) {
      if (!(loiTao instanceof LoiHttp) || loiTao.maTrangThai !== 409) throw loiTao;
      const ketQuaTimLai = await layDanhSachLoaiThietBi({ trang: 1, gioiHan: 20, tuKhoa: tenLoai });
      const loaiVuaDuocTao = ketQuaTimLai.danhSach.find((loaiThietBi) => loaiThietBi.tenLoai.trim().toLocaleLowerCase("vi-VN") === tenLoai.toLocaleLowerCase("vi-VN"));
      if (!loaiVuaDuocTao) throw loiTao;
      return loaiVuaDuocTao;
    }
  }

  function xuLyThemHangMuc() {
    datDanhSachHangMuc((danhSachCu) => {
      const khoaMoi = danhSachCu.reduce((khoaLonNhat, hangMuc) => Math.max(khoaLonNhat, hangMuc.khoa), 0) + 1;
      return [...danhSachCu, taoHangMuc(khoaMoi)];
    });
  }

  function xuLyCapNhatHangMuc(khoa: number, noiDung: string) {
    datDanhSachHangMuc((danhSachCu) => danhSachCu.map((hangMuc) => hangMuc.khoa === khoa ? { ...hangMuc, noiDung } : hangMuc));
    datLoi((loiHienTai) => ({ ...loiHienTai, danhSachHangMuc: "", chung: "" }));
  }

  function xuLyXoaHangMuc(khoa: number) {
    datDanhSachHangMuc((danhSachCu) => danhSachCu.filter((hangMuc) => hangMuc.khoa !== khoa));
  }

  function kiemTraDuLieu() {
    const loiMoi: Record<string, string> = {};
    if (!tenMau.trim()) loiMoi.tenMau = "Tên mẫu không được để trống.";
    else if (tenMau.trim().length > 255) loiMoi.tenMau = "Tên mẫu không được vượt quá 255 ký tự.";
    if (danhSachHangMuc.length === 0) loiMoi.danhSachHangMuc = "Cần ít nhất một hạng mục.";
    else if (danhSachHangMuc.some((hangMuc) => !hangMuc.noiDung.trim())) loiMoi.danhSachHangMuc = "Nội dung hạng mục không được để trống.";
    else if (danhSachHangMuc.some((hangMuc) => hangMuc.noiDung.trim().length > 500)) loiMoi.danhSachHangMuc = "Mỗi hạng mục không được vượt quá 500 ký tự.";
    if (moTa.trim().length > 10000) loiMoi.moTa = "Mô tả không được vượt quá 10000 ký tự.";
    datLoi(loiMoi);
    return Object.keys(loiMoi).length === 0;
  }

  async function xuLyLuu(suKien: FormEvent<HTMLFormElement>) {
    suKien.preventDefault();
    if (dangLuu || !kiemTraDuLieu()) return;
    datDangLuu(true);
    try {
      let loaiThietBiDaChon: LoaiThietBi | null = null;
      const tenLoaiThietBiDaNhap = tenLoaiThietBi.trim();
      if (tenLoaiThietBiDaNhap) {
        loaiThietBiDaChon = await layHoacTaoLoaiThietBi(tenLoaiThietBiDaNhap);
        datTenLoaiThietBi(loaiThietBiDaChon.tenLoai);
      }
      const duLieuMauChecklist = {
        tenMau: tenMau.trim(),
        loaiThietBiId: loaiThietBiDaChon?.id ?? null,
        danhSachHangMuc: danhSachHangMuc.map((hangMuc) => ({ noiDung: hangMuc.noiDung.trim() })),
        moTa: moTa.trim() || null,
      };
      if (mauChecklist) {
        await capNhatMauChecklist(mauChecklist.id, duLieuMauChecklist);
        xuLyLuuThanhCong("Đã cập nhật mẫu checklist.");
      } else {
        await taoMauChecklist(duLieuMauChecklist);
        xuLyLuuThanhCong("Đã tạo mẫu checklist.");
      }
    } catch (loiGui) {
      datLoi((loiHienTai) => ({ ...loiHienTai, chung: layTenLoi(loiGui, "Không thể lưu mẫu checklist.") }));
    } finally {
      datDangLuu(false);
    }
  }

  function xuLyDong() {
    if (!dangLuu) xuLyDongBieuMau();
  }

  return (
    <div className="lop-phu" role="presentation" onMouseDown={(suKien) => suKien.target === suKien.currentTarget && xuLyDong()}>
      <section className="hop-thoai hop-thoai-checklist" role="dialog" aria-modal="true" aria-labelledby="tieu-de-mau-checklist">
        <header className="dau-hop-thoai"><h2 id="tieu-de-mau-checklist">{mauChecklist ? "Cập nhật mẫu checklist" : "Tạo mẫu checklist"}</h2><button className="nut-dong" type="button" onClick={xuLyDong} aria-label="Đóng">×</button></header>
        <form className="bieu-mau bieu-mau-them" onSubmit={xuLyLuu}>
          {loi.chung && <div className="thong-bao loi" role="alert">{loi.chung}</div>}
          <div className="luoi-hai-cot">
            <div className="nhom-truong"><label htmlFor="ten-mau-checklist">Tên mẫu <em>*</em></label><input id="ten-mau-checklist" value={tenMau} maxLength={255} disabled={dangLuu} onChange={(suKien) => { datTenMau(suKien.target.value); datLoi((loiHienTai) => ({ ...loiHienTai, tenMau: "", chung: "" })); }} />{loi.tenMau && <span className="loi-truong">{loi.tenMau}</span>}</div>
            <div className="nhom-truong"><label htmlFor="loai-thiet-bi-checklist">Loại thiết bị</label><input id="loai-thiet-bi-checklist" value={tenLoaiThietBi} placeholder="Nhập tên loại thiết bị hoặc để trống nếu dùng chung" autoComplete="off" disabled={dangLuu} onChange={(suKien) => { datTenLoaiThietBi(suKien.target.value); datLoi((loiHienTai) => ({ ...loiHienTai, loaiThietBiId: "", chung: "" })); }} />{loi.loaiThietBiId && <span className="loi-truong">{loi.loaiThietBiId}</span>}</div>
          </div>
          <div className="nhom-truong"><div className="dau-danh-sach-hang-muc"><label>Danh sách hạng mục <em>*</em></label><button className="nut nut-phu nut-nho" type="button" onClick={xuLyThemHangMuc} disabled={dangLuu || danhSachHangMuc.length >= 200}>Thêm hạng mục</button></div><div className="danh-sach-hang-muc">{danhSachHangMuc.map((hangMuc, viTri) => <div className="dong-hang-muc" key={hangMuc.khoa}><span>{viTri + 1}</span><input value={hangMuc.noiDung} maxLength={500} aria-label={`Hạng mục ${viTri + 1}`} disabled={dangLuu} onChange={(suKien) => xuLyCapNhatHangMuc(hangMuc.khoa, suKien.target.value)} /><button type="button" className="nut-xoa-hang-muc" aria-label={`Xóa hạng mục ${viTri + 1}`} disabled={dangLuu} onClick={() => xuLyXoaHangMuc(hangMuc.khoa)}>×</button></div>)}</div>{loi.danhSachHangMuc && <span className="loi-truong">{loi.danhSachHangMuc}</span>}</div>
          <div className="nhom-truong"><label htmlFor="mo-ta-checklist">Mô tả</label><textarea id="mo-ta-checklist" rows={3} value={moTa} disabled={dangLuu} onChange={(suKien) => { datMoTa(suKien.target.value); datLoi((loiHienTai) => ({ ...loiHienTai, moTa: "", chung: "" })); }} />{loi.moTa && <span className="loi-truong">{loi.moTa}</span>}</div>
          <footer className="chan-hop-thoai"><button className="nut nut-phu" type="button" onClick={xuLyDong} disabled={dangLuu}>Hủy</button><button className="nut nut-chinh" type="submit" disabled={dangLuu}>{dangLuu ? "Đang lưu..." : mauChecklist ? "Lưu thay đổi" : "Tạo mẫu"}</button></footer>
        </form>
      </section>
    </div>
  );
}
