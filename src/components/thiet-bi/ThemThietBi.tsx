"use client";

import { FormEvent, useState } from "react";
import { themThietBi } from "@/services/thietBi.service";
import type { LoiHttp } from "@/types/api";
import type {
  DuLieuThemThietBi,
  LoaiThietBi,
  LoNhap,
  ViTri,
} from "@/types/thietBi";
import {
  DANH_SACH_TRANG_THAI_THIET_BI,
  NHAN_TRANG_THAI_THIET_BI,
  kiemTraGiaMua,
  kiemTraIdHopLe,
  kiemTraNgayBaoHanh,
  kiemTraTenThietBi,
  kiemTraTrangThaiThietBi,
} from "@/utils/kiemTraThietBi";

interface Props {
  dangMo: boolean;
  dong: () => void;
  thanhCong: () => void;
  danhSachLoai: LoaiThietBi[];
  danhSachViTri: ViTri[];
  danhSachLoNhap: LoNhap[];
}

const DU_LIEU_BAN_DAU: DuLieuThemThietBi = {
  tenThietBi: "",
  loaiThietBiId: 0,
  viTriId: null,
  loNhapId: null,
  soSerial: "",
  model: "",
  hangSanXuat: "",
  anhThietBi: null,
  giaMua: null,
  ngayBatDauBaoHanh: "",
  ngayHetBaoHanh: "",
  trangThai: "DANG_HOAT_DONG",
  moTa: "",
};

export default function ThemThietBi({
  dangMo,
  dong,
  thanhCong,
  danhSachLoai,
  danhSachViTri,
  danhSachLoNhap,
}: Props) {
  const [duLieu, datDuLieu] = useState(DU_LIEU_BAN_DAU);
  const [loi, datLoi] = useState<Record<string, string>>({});
  const [dangXuLy, datDangXuLy] = useState(false);

  if (!dangMo) return null;

  function capNhat(
    tenTruong: keyof DuLieuThemThietBi,
    giaTri: string | number | null,
  ) {
    datDuLieu((duLieuCu) => ({
      ...duLieuCu,
      [tenTruong]: giaTri,
    }));
    datLoi((loiCu) => ({
      ...loiCu,
      [tenTruong]: "",
      chung: "",
    }));
  }

  function kiemTra() {
    const loiMoi: Record<string, string> = {};
    const loiTen = kiemTraTenThietBi(duLieu.tenThietBi);
    const loiGia = kiemTraGiaMua(duLieu.giaMua);
    const loiNgay = kiemTraNgayBaoHanh(
      duLieu.ngayBatDauBaoHanh,
      duLieu.ngayHetBaoHanh,
    );

    if (loiTen) loiMoi.tenThietBi = loiTen;
    if (!kiemTraIdHopLe(duLieu.loaiThietBiId)) {
      loiMoi.loaiThietBiId = "Vui lòng chọn loại thiết bị.";
    }
    if (duLieu.viTriId !== null && !kiemTraIdHopLe(duLieu.viTriId)) {
      loiMoi.viTriId = "Vị trí không hợp lệ.";
    }
    if (duLieu.loNhapId !== null && !kiemTraIdHopLe(duLieu.loNhapId)) {
      loiMoi.loNhapId = "Lô nhập không hợp lệ.";
    }
    if (loiGia) loiMoi.giaMua = loiGia;
    if (loiNgay) loiMoi.ngayHetBaoHanh = loiNgay;
    if (!kiemTraTrangThaiThietBi(duLieu.trangThai)) {
      loiMoi.trangThai = "Trạng thái thiết bị không hợp lệ.";
    }

    datLoi(loiMoi);
    return Object.keys(loiMoi).length === 0;
  }

  async function xuLyGui(suKien: FormEvent) {
    suKien.preventDefault();
    if (!kiemTra()) return;

    datDangXuLy(true);

    try {
      const duLieuGui: DuLieuThemThietBi = {
        ...duLieu,
        tenThietBi: duLieu.tenThietBi.trim(),
        soSerial: duLieu.soSerial?.trim() || undefined,
        model: duLieu.model?.trim() || undefined,
        hangSanXuat: duLieu.hangSanXuat?.trim() || undefined,
        moTa: duLieu.moTa?.trim() || undefined,
        giaMua:
          duLieu.giaMua === null || duLieu.giaMua === undefined
            ? null
            : Number(duLieu.giaMua),
        ngayBatDauBaoHanh: duLieu.ngayBatDauBaoHanh || null,
        ngayHetBaoHanh: duLieu.ngayHetBaoHanh || null,
      };

      await themThietBi(duLieuGui);
      datDuLieu(DU_LIEU_BAN_DAU);
      datLoi({});
      thanhCong();
    } catch (loiGui) {
      const loiHttp = loiGui as LoiHttp;
      datLoi({
        chung:
          loiHttp.maTrangThai === 409
            ? "Số serial đã tồn tại."
            : loiHttp.message,
      });
    } finally {
      datDangXuLy(false);
    }
  }

  return (
    <div className="lop-phu">
      <section className="hop-thoai" role="dialog" aria-modal="true">
        <header className="dau-hop-thoai">
          <h2>Thêm thiết bị</h2>
          <button
            className="nut-dong"
            type="button"
            onClick={dong}
            aria-label="Đóng"
          >
            ×
          </button>
        </header>

        <form className="bieu-mau bieu-mau-them" onSubmit={xuLyGui}>
          {loi.chung && <div className="thong-bao loi">{loi.chung}</div>}

          <div className="luoi-hai-cot">
            <div className="nhom-truong">
              <label htmlFor="ten-thiet-bi">
                Tên thiết bị <em>*</em>
              </label>
              <input
                id="ten-thiet-bi"
                value={duLieu.tenThietBi}
                onChange={(suKien) =>
                  capNhat("tenThietBi", suKien.target.value)
                }
              />
              {loi.tenThietBi && (
                <span className="loi-truong">{loi.tenThietBi}</span>
              )}
            </div>

            <div className="nhom-truong">
              <label htmlFor="loai-thiet-bi">
                Loại thiết bị <em>*</em>
              </label>
              <select
                id="loai-thiet-bi"
                value={duLieu.loaiThietBiId || ""}
                onChange={(suKien) =>
                  capNhat("loaiThietBiId", Number(suKien.target.value))
                }
              >
                <option value="">Chọn loại</option>
                {danhSachLoai.map((loai) => (
                  <option key={loai.id} value={loai.id}>
                    {loai.tenLoai}
                  </option>
                ))}
              </select>
              {loi.loaiThietBiId && (
                <span className="loi-truong">{loi.loaiThietBiId}</span>
              )}
            </div>

            <div className="nhom-truong">
              <label htmlFor="serial">Serial</label>
              <input
                id="serial"
                value={duLieu.soSerial || ""}
                onChange={(suKien) => capNhat("soSerial", suKien.target.value)}
              />
            </div>

            <div className="nhom-truong">
              <label htmlFor="model">Model</label>
              <input
                id="model"
                value={duLieu.model || ""}
                onChange={(suKien) => capNhat("model", suKien.target.value)}
              />
            </div>

            <div className="nhom-truong">
              <label htmlFor="hang-san-xuat">Hãng sản xuất</label>
              <input
                id="hang-san-xuat"
                value={duLieu.hangSanXuat || ""}
                onChange={(suKien) =>
                  capNhat("hangSanXuat", suKien.target.value)
                }
              />
            </div>

            <div className="nhom-truong">
              <label htmlFor="gia-mua">Giá mua</label>
              <input
                id="gia-mua"
                type="number"
                min="0"
                value={duLieu.giaMua ?? ""}
                onChange={(suKien) => capNhat("giaMua", suKien.target.value)}
              />
              {loi.giaMua && <span className="loi-truong">{loi.giaMua}</span>}
            </div>

            <div className="nhom-truong">
              <label htmlFor="vi-tri">Vị trí</label>
              <select
                id="vi-tri"
                value={duLieu.viTriId ?? ""}
                onChange={(suKien) =>
                  capNhat(
                    "viTriId",
                    suKien.target.value ? Number(suKien.target.value) : null,
                  )
                }
              >
                <option value="">Chưa chọn</option>
                {danhSachViTri.map((viTri) => (
                  <option key={viTri.id} value={viTri.id}>
                    {viTri.tenViTri}
                  </option>
                ))}
              </select>
              {loi.viTriId && <span className="loi-truong">{loi.viTriId}</span>}
            </div>

            <div className="nhom-truong">
              <label htmlFor="lo-nhap">Lô nhập</label>
              <select
                id="lo-nhap"
                value={duLieu.loNhapId ?? ""}
                onChange={(suKien) =>
                  capNhat(
                    "loNhapId",
                    suKien.target.value ? Number(suKien.target.value) : null,
                  )
                }
              >
                <option value="">Chưa chọn</option>
                {danhSachLoNhap.map((loNhap) => (
                  <option key={loNhap.id} value={loNhap.id}>
                    {loNhap.maLo}
                  </option>
                ))}
              </select>
              {loi.loNhapId && (
                <span className="loi-truong">{loi.loNhapId}</span>
              )}
            </div>

            <div className="nhom-truong">
              <label htmlFor="trang-thai">
                Trạng thái <em>*</em>
              </label>
              <select
                id="trang-thai"
                value={duLieu.trangThai}
                onChange={(suKien) => capNhat("trangThai", suKien.target.value)}
              >
                {DANH_SACH_TRANG_THAI_THIET_BI.map((trangThai) => (
                  <option key={trangThai} value={trangThai}>
                    {NHAN_TRANG_THAI_THIET_BI[trangThai]}
                  </option>
                ))}
              </select>
              {loi.trangThai && (
                <span className="loi-truong">{loi.trangThai}</span>
              )}
            </div>

            <div className="nhom-truong">
              <label htmlFor="ngay-bat-dau">Bắt đầu bảo hành</label>
              <input
                id="ngay-bat-dau"
                type="date"
                value={duLieu.ngayBatDauBaoHanh || ""}
                onChange={(suKien) =>
                  capNhat("ngayBatDauBaoHanh", suKien.target.value)
                }
              />
            </div>

            <div className="nhom-truong">
              <label htmlFor="ngay-ket-thuc">Hết bảo hành</label>
              <input
                id="ngay-ket-thuc"
                type="date"
                value={duLieu.ngayHetBaoHanh || ""}
                onChange={(suKien) =>
                  capNhat("ngayHetBaoHanh", suKien.target.value)
                }
              />
              {loi.ngayHetBaoHanh && (
                <span className="loi-truong">{loi.ngayHetBaoHanh}</span>
              )}
            </div>

            <div className="nhom-truong">
              <label htmlFor="mo-ta">Mô tả</label>
              <input
                id="mo-ta"
                value={duLieu.moTa || ""}
                onChange={(suKien) => capNhat("moTa", suKien.target.value)}
              />
            </div>
          </div>

          <footer className="chan-hop-thoai">
            <button
              type="button"
              className="nut nut-phu"
              onClick={dong}
              disabled={dangXuLy}
            >
              Hủy
            </button>
            <button className="nut nut-chinh" disabled={dangXuLy}>
              {dangXuLy ? "Đang lưu..." : "Lưu"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}
