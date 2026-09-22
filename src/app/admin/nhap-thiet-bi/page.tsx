"use client";
import { ChangeEvent, useState } from "react";
import { nhapThietBi, xemTruocNhapThietBi } from "@/services/thietBi.service";
import type { KetQuaImport } from "@/types/quanLyThietBi";
import type { LoiHttp } from "@/types/api";
const KICH_THUOC_TOI_DA = 5 * 1024 * 1024;
export default function TrangNhapThietBi() {
  const [tep, datTep] = useState<File | null>(null);
  const [ketQua, datKetQua] = useState<KetQuaImport | null>(null);
  const [loi, datLoi] = useState("");
  const [dangTai, datDangTai] = useState(false);
  const [thongBao, datThongBao] = useState("");
  function chonTep(suKien: ChangeEvent<HTMLInputElement>) {
    const tepMoi = suKien.target.files?.[0] || null;
    datLoi("");
    datKetQua(null);
    datThongBao("");
    if (!tepMoi) {
      datTep(null);
      return;
    }
    const duoi = tepMoi.name.toLowerCase();
    if (!(duoi.endsWith(".xlsx") || duoi.endsWith(".csv"))) {
      datTep(null);
      datLoi("File không đúng định dạng.");
      return;
    }
    if (tepMoi.size === 0) {
      datTep(null);
      datLoi("Không thể đọc file.");
      return;
    }
    if (tepMoi.size > KICH_THUOC_TOI_DA) {
      datTep(null);
      datLoi("File vượt quá dung lượng cho phép.");
      return;
    }
    datTep(tepMoi);
  }
  async function xemTruoc() {
    if (!tep) {
      datLoi("Vui lòng chọn file.");
      return;
    }
    datDangTai(true);
    datLoi("");
    try {
      datKetQua(await xemTruocNhapThietBi(tep));
    } catch (e) {
      datLoi((e as LoiHttp).message);
    } finally {
      datDangTai(false);
    }
  }
  async function xacNhan() {
    if (!tep || !ketQua) return;
    datDangTai(true);
    datLoi("");
    try {
      await nhapThietBi(tep);
      datThongBao("Import thành công.");
      datTep(null);
      datKetQua(null);
    } catch (e) {
      datLoi((e as LoiHttp).message);
    } finally {
      datDangTai(false);
    }
  }
  const tongSoDong =
    ketQua?.tongSoDong ??
    (ketQua?.danhSachDongHopLe?.length || 0) +
      (ketQua?.danhSachLoi?.length || 0);
  const soDongHopLe =
    ketQua?.soDongHopLe ?? ketQua?.danhSachDongHopLe?.length ?? 0;
  const soDongLoi = ketQua?.soDongLoi ?? ketQua?.danhSachLoi?.length ?? 0;
  return (
    <>
      <section className="thanh-cong-cu">
        <a className="nut nut-phu" href="/mau-nhap-thiet-bi.csv" download>
          Tải mẫu
        </a>
      </section>
      {thongBao && <div className="thong-bao thanh-cong">{thongBao}</div>}
      <section className="the-noi-dung">
        <div className="noi-dung-chi-tiet">
          <div className="nhom-truong">
            <label htmlFor="tep-nhap">File Excel hoặc CSV</label>
            <input
              id="tep-nhap"
              type="file"
              accept=".xlsx,.csv"
              onChange={chonTep}
              disabled={dangTai}
            />
            {tep && <span className="ten-tep-anh">{tep.name}</span>}
          </div>
          {loi && <div className="thong-bao loi">{loi}</div>}
          <footer className="chan-chi-tiet">
            <button
              className="nut nut-chinh"
              onClick={xemTruoc}
              disabled={!tep || dangTai}
            >
              {dangTai ? "Đang xử lý..." : "Xem trước"}
            </button>
          </footer>
        </div>
        {ketQua && (
          <div className="noi-dung-chi-tiet">
            <div className="luoi-thong-tin">
              <div>
                <dt>Tổng số dòng</dt>
                <dd>{tongSoDong}</dd>
              </div>
              <div>
                <dt>Dòng hợp lệ</dt>
                <dd>{soDongHopLe}</dd>
              </div>
              <div>
                <dt>Dòng lỗi</dt>
                <dd>{soDongLoi}</dd>
              </div>
            </div>
            {ketQua.danhSachLoi?.map((loi, index) => (
              <div className="thong-bao loi" key={`${loi.dong}-${loi.cot || ""}-${index}`}>
                Dòng {loi.dong}{loi.cot ? `, cột ${loi.cot}` : ""}: {loi.thongBao}
              </div>
            ))}
            <button
              className="nut nut-chinh"
              onClick={xacNhan}
              disabled={dangTai || !soDongHopLe || soDongLoi > 0}
            >
              {dangTai ? "Đang import..." : "Xác nhận import"}
            </button>
          </div>
        )}
      </section>
    </>
  );
}
