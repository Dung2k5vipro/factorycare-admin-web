"use client";
import { FormEvent, useEffect, useState } from "react";
import {
  capNhatBaoHanhThietBi,
  layBaoHanhThietBi,
  layDanhSachThietBi,
} from "@/services/thietBi.service";
import type { LoiHttp } from "@/types/api";
import type { ThietBi } from "@/types/thietBi";
export default function TrangBaoHanh() {
  const [danhSach, datDanhSach] = useState<ThietBi[]>([]);
  const [thietBiId, datThietBiId] = useState("");
  const [ngayBatDau, datNgayBatDau] = useState("");
  const [ngayHet, datNgayHet] = useState("");
  const [loi, datLoi] = useState("");
  const [thongBao, datThongBao] = useState("");
  const [dangXuLy, datDangXuLy] = useState(false);
  const thietBi = danhSach.find((x) => x.id === Number(thietBiId));
  useEffect(() => {
    layDanhSachThietBi({ trang: 1, gioiHan: 100 })
      .then((kq) => datDanhSach(kq.danhSach))
      .catch(() => undefined);
  }, []);
  async function chonThietBi(id: string) {
    datThietBiId(id);
    datLoi("");
    if (!id) {
      datNgayBatDau("");
      datNgayHet("");
      return;
    }
    try {
      const kq = await layBaoHanhThietBi(Number(id));
      datNgayBatDau(kq.ngayBatDauBaoHanh || "");
      datNgayHet(kq.ngayHetBaoHanh || "");
    } catch (e) {
      datLoi((e as LoiHttp).message);
    }
  }
  async function luu(suKien: FormEvent) {
    suKien.preventDefault();
    if (!thietBiId) {
      datLoi("Vui lòng chọn thiết bị.");
      return;
    }
    if (!ngayBatDau || !ngayHet) {
      datLoi("Vui lòng nhập đủ thời hạn bảo hành.");
      return;
    }
    if (ngayHet < ngayBatDau) {
      datLoi("Ngày hết bảo hành phải sau hoặc bằng ngày bắt đầu.");
      return;
    }
    datDangXuLy(true);
    try {
      await capNhatBaoHanhThietBi(Number(thietBiId), ngayBatDau, ngayHet);
      datThongBao("Cập nhật bảo hành thành công.");
    } catch (e) {
      datLoi((e as LoiHttp).message);
    } finally {
      datDangXuLy(false);
    }
  }
  const trangThai = !ngayHet
    ? "Chưa xác định"
    : ngayHet >= new Date().toISOString().slice(0, 10)
      ? "Còn bảo hành"
      : "Hết bảo hành";
  return (
    <section className="the-noi-dung">
      <div className="noi-dung-chi-tiet">
        <h2>Bảo hành</h2>
        {thongBao && <div className="thong-bao thanh-cong">{thongBao}</div>}
        {loi && <div className="thong-bao loi">{loi}</div>}
        <form className="bieu-mau" onSubmit={luu}>
          <div className="nhom-truong">
            <label>
              Thiết bị <em>*</em>
            </label>
            <select
              value={thietBiId}
              onChange={(e) => chonThietBi(e.target.value)}
            >
              <option value="">Chọn thiết bị</option>
              {danhSach.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.maThietBi} - {item.tenThietBi}
                </option>
              ))}
            </select>
          </div>
          <div className="nhom-truong">
            <label>Ngày bắt đầu</label>
            <input
              type="date"
              value={ngayBatDau}
              onChange={(e) => {
                datNgayBatDau(e.target.value);
                datLoi("");
              }}
            />
          </div>
          <div className="nhom-truong">
            <label>Ngày hết hạn</label>
            <input
              type="date"
              value={ngayHet}
              onChange={(e) => {
                datNgayHet(e.target.value);
                datLoi("");
              }}
            />
          </div>
          <div className="thong-ke-nho">
            Trạng thái: <strong>{trangThai}</strong>
          </div>
          <button className="nut nut-chinh" disabled={dangXuLy}>
            {dangXuLy ? "Đang lưu..." : "Lưu"}
          </button>
        </form>
        {thietBi && <p className="thong-ke-nho">{thietBi.tenThietBi}</p>}
      </div>
    </section>
  );
}
