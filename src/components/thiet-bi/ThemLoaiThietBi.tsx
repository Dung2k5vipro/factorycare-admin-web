"use client";

import { FormEvent, useState } from "react";
import { themLoaiThietBi } from "@/services/thietBi.service";
import type { LoiHttp } from "@/types/api";

interface Props {
  dangMo: boolean;
  dong: () => void;
  thanhCong: () => void;
}

export default function ThemLoaiThietBi({ dangMo, dong, thanhCong }: Props) {
  const [tenLoai, datTenLoai] = useState("");
  const [moTa, datMoTa] = useState("");
  const [loi, datLoi] = useState("");
  const [dangXuLy, datDangXuLy] = useState(false);

  if (!dangMo) return null;

  async function xuLyGui(suKien: FormEvent) {
    suKien.preventDefault();

    if (!tenLoai.trim()) {
      datLoi("Tên loại thiết bị không được để trống.");
      return;
    }

    datDangXuLy(true);
    datLoi("");

    try {
      await themLoaiThietBi({
        tenLoai: tenLoai.trim(),
        moTa: moTa.trim() || undefined,
      });
      datTenLoai("");
      datMoTa("");
      thanhCong();
    } catch (loiGui) {
      const loiHttp = loiGui as LoiHttp;
      datLoi(
        loiHttp.maTrangThai === 409
          ? "Loại thiết bị đã tồn tại."
          : loiHttp.message,
      );
    } finally {
      datDangXuLy(false);
    }
  }

  return (
    <div className="lop-phu">
      <section className="hop-thoai" role="dialog" aria-modal="true">
        <header className="dau-hop-thoai">
          <h2>Thêm loại thiết bị</h2>
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
          {loi && <div className="thong-bao loi">{loi}</div>}

          <div className="nhom-truong">
            <label htmlFor="ten-loai">
              Tên loại <em>*</em>
            </label>
            <input
              id="ten-loai"
              value={tenLoai}
              onChange={(suKien) => {
                datTenLoai(suKien.target.value);
                datLoi("");
              }}
            />
          </div>

          <div className="nhom-truong">
            <label htmlFor="mo-ta-loai">Mô tả</label>
            <input
              id="mo-ta-loai"
              value={moTa}
              onChange={(suKien) => datMoTa(suKien.target.value)}
            />
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
