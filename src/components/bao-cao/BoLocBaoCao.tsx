import type { FormEvent } from "react";
import type { NguoiDung } from "@/types/nguoiDung";
import type { CayViTri } from "@/types/quanLyThietBi";
import type { BoLocBaoCao, LoaiBaoCao } from "@/types/dashboardBaoCao";
import type { LoaiThietBi, ThietBi } from "@/types/thietBi";
import { NHAN_KET_QUA_SUA_CHUA, NHAN_MUC_DO_SU_CO, NHAN_TRANG_THAI_SU_CO } from "@/utils/dinhDangSuCo";
import { NHAN_TRANG_THAI_PHIEU } from "@/utils/baoTri";
import { DANH_SACH_TRANG_THAI_THIET_BI, NHAN_TRANG_THAI_THIET_BI } from "@/utils/kiemTraThietBi";
import { CAU_HINH_SAP_XEP, NHAN_LOAI_BAO_CAO } from "@/utils/dashboardBaoCao";

interface ThuocTinhBoLocBaoCao {
  loaiBaoCao: LoaiBaoCao;
  boLoc: BoLocBaoCao;
  danhSachThietBi: ThietBi[];
  danhSachLoaiThietBi: LoaiThietBi[];
  danhSachViTri: CayViTri[];
  danhSachKyThuatVien: NguoiDung[];
  dangTai: boolean;
  loiBoLoc: string;
  xuLyDoiLoaiBaoCao: (loaiBaoCao: LoaiBaoCao) => void;
  xuLyCapNhatBoLoc: (phanBoLocThayDoi: Partial<BoLocBaoCao>) => void;
  xuLyApDungBoLoc: (suKien: FormEvent<HTMLFormElement>) => void;
  xuLyXoaBoLoc: () => void;
}

export default function BoLocBaoCao({
  loaiBaoCao,
  boLoc,
  danhSachThietBi,
  danhSachLoaiThietBi,
  danhSachViTri,
  danhSachKyThuatVien,
  dangTai,
  loiBoLoc,
  xuLyDoiLoaiBaoCao,
  xuLyCapNhatBoLoc,
  xuLyApDungBoLoc,
  xuLyXoaBoLoc,
}: ThuocTinhBoLocBaoCao) {
  const coPhaiBaoCaoThietBi = loaiBaoCao === "thiet-bi";

  return (
    <form className="bo-loc-bao-cao" onSubmit={xuLyApDungBoLoc}>
      <div className="hang-loc-chinh">
        <label>
          Loại báo cáo
          <select value={loaiBaoCao} onChange={(suKien) => xuLyDoiLoaiBaoCao(suKien.target.value as LoaiBaoCao)}>
            {Object.entries(NHAN_LOAI_BAO_CAO).map(([giaTri, nhan]) => <option key={giaTri} value={giaTri}>{nhan}</option>)}
          </select>
        </label>
        {!coPhaiBaoCaoThietBi && <>
          <label>Từ ngày<input type="date" value={boLoc.tuNgay || ""} onChange={(suKien) => xuLyCapNhatBoLoc({ tuNgay: suKien.target.value || undefined })} /></label>
          <label>Đến ngày<input type="date" value={boLoc.denNgay || ""} onChange={(suKien) => xuLyCapNhatBoLoc({ denNgay: suKien.target.value || undefined })} /></label>
        </>}
        <label>
          Sắp xếp
          <select value={boLoc.sapXepTheo || ""} onChange={(suKien) => xuLyCapNhatBoLoc({ sapXepTheo: suKien.target.value })}>
            {CAU_HINH_SAP_XEP[loaiBaoCao].map((cauHinhSapXep) => <option key={cauHinhSapXep.giaTri} value={cauHinhSapXep.giaTri}>{cauHinhSapXep.nhan}</option>)}
          </select>
        </label>
        <label>
          Thứ tự
          <select value={boLoc.thuTu || "DESC"} onChange={(suKien) => xuLyCapNhatBoLoc({ thuTu: suKien.target.value as "ASC" | "DESC" })}>
            <option value="DESC">Giảm dần</option>
            <option value="ASC">Tăng dần</option>
          </select>
        </label>
      </div>

      <details className="bo-loc-nang-cao">
        <summary>Bộ lọc nâng cao</summary>
        <div className="luoi-loc-nang-cao">
          <label>
            Thiết bị
            <select value={boLoc.thietBiId || ""} onChange={(suKien) => xuLyCapNhatBoLoc({ thietBiId: suKien.target.value ? Number(suKien.target.value) : undefined })}>
              <option value="">Tất cả thiết bị</option>
              {danhSachThietBi.map((thietBi) => <option key={thietBi.id} value={thietBi.id}>{thietBi.maThietBi} · {thietBi.tenThietBi}</option>)}
            </select>
          </label>
          <label>
            Loại thiết bị
            <select value={boLoc.loaiThietBiId || ""} onChange={(suKien) => xuLyCapNhatBoLoc({ loaiThietBiId: suKien.target.value ? Number(suKien.target.value) : undefined })}>
              <option value="">Tất cả loại thiết bị</option>
              {danhSachLoaiThietBi.map((loaiThietBi) => <option key={loaiThietBi.id} value={loaiThietBi.id}>{loaiThietBi.tenLoai}</option>)}
            </select>
          </label>
          <label>
            Vị trí
            <select value={boLoc.viTriId || ""} onChange={(suKien) => xuLyCapNhatBoLoc({ viTriId: suKien.target.value ? Number(suKien.target.value) : undefined })}>
              <option value="">Tất cả vị trí</option>
              {danhSachViTri.map((viTri) => <option key={viTri.id} value={viTri.id}>{viTri.tenViTri}</option>)}
            </select>
          </label>
          {!coPhaiBaoCaoThietBi && <label>
            Kỹ thuật viên
            <select value={boLoc.kyThuatVienId || ""} onChange={(suKien) => xuLyCapNhatBoLoc({ kyThuatVienId: suKien.target.value ? Number(suKien.target.value) : undefined })}>
              <option value="">Tất cả kỹ thuật viên</option>
              {danhSachKyThuatVien.map((kyThuatVien) => <option key={kyThuatVien.id} value={kyThuatVien.id}>{kyThuatVien.hoTen}</option>)}
            </select>
          </label>}

          {loaiBaoCao === "su-co" && <>
            <label>
              Mức độ
              <select value={boLoc.mucDo || ""} onChange={(suKien) => xuLyCapNhatBoLoc({ mucDo: (suKien.target.value || undefined) as BoLocBaoCao["mucDo"] })}>
                <option value="">Tất cả mức độ</option>
                {Object.entries(NHAN_MUC_DO_SU_CO).map(([giaTri, nhan]) => <option key={giaTri} value={giaTri}>{nhan}</option>)}
              </select>
            </label>
            <label>
              Trạng thái
              <select value={boLoc.trangThai || ""} onChange={(suKien) => xuLyCapNhatBoLoc({ trangThai: (suKien.target.value || undefined) as BoLocBaoCao["trangThai"] })}>
                <option value="">Tất cả trạng thái</option>
                {Object.entries(NHAN_TRANG_THAI_SU_CO).map(([giaTri, nhan]) => <option key={giaTri} value={giaTri}>{nhan}</option>)}
              </select>
            </label>
          </>}
          {loaiBaoCao === "sua-chua" && <label>
            Kết quả
            <select value={boLoc.ketQua || ""} onChange={(suKien) => xuLyCapNhatBoLoc({ ketQua: (suKien.target.value || undefined) as BoLocBaoCao["ketQua"] })}>
              <option value="">Tất cả kết quả</option>
              {Object.entries(NHAN_KET_QUA_SUA_CHUA).map(([giaTri, nhan]) => <option key={giaTri} value={giaTri}>{nhan}</option>)}
            </select>
          </label>}
          {loaiBaoCao === "bao-tri" && <label>
            Trạng thái
            <select value={boLoc.trangThai || ""} onChange={(suKien) => xuLyCapNhatBoLoc({ trangThai: (suKien.target.value || undefined) as BoLocBaoCao["trangThai"] })}>
              <option value="">Tất cả trạng thái</option>
              {Object.entries(NHAN_TRANG_THAI_PHIEU).map(([giaTri, nhan]) => <option key={giaTri} value={giaTri}>{nhan}</option>)}
            </select>
          </label>}
          {loaiBaoCao === "thiet-bi" && <label>
            Trạng thái
            <select value={boLoc.trangThai || ""} onChange={(suKien) => xuLyCapNhatBoLoc({ trangThai: (suKien.target.value || undefined) as BoLocBaoCao["trangThai"] })}>
              <option value="">Tất cả trạng thái</option>
              {DANH_SACH_TRANG_THAI_THIET_BI.map((giaTri) => <option key={giaTri} value={giaTri}>{NHAN_TRANG_THAI_THIET_BI[giaTri]}</option>)}
            </select>
          </label>}
        </div>
      </details>

      <div className="hanh-dong-bo-loc">
        <button className="nut nut-chinh" type="submit" disabled={dangTai}>Áp dụng</button>
        <button className="nut nut-phu" type="button" onClick={xuLyXoaBoLoc} disabled={dangTai}>Xóa bộ lọc</button>
        {loiBoLoc && <span className="loi-truong">{loiBoLoc}</span>}
      </div>
    </form>
  );
}
