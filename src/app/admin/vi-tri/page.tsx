"use client";

/* eslint-disable react-hooks/set-state-in-effect */
import { FormEvent, useEffect, useState } from "react";
import { capNhatViTri, layCayViTri, themViTri } from "@/services/viTri.service";
import type { LoiHttp } from "@/types/api";
import type { CayViTri, LoaiViTri } from "@/types/quanLyThietBi";
import {
  DANH_SACH_LOAI_VI_TRI,
  NHAN_LOAI_VI_TRI,
} from "@/utils/kiemTraQuanLyThietBi";

interface CayProps {
  danhSach: CayViTri[];
  chon: (viTri: CayViTri) => void;
}

function Cay({ danhSach, chon }: CayProps) {
  return (
    <ul className="cay-vi-tri">
      {danhSach.map((viTri) => (
        <li key={viTri.id}>
          <button className="nut-cay" onClick={() => chon(viTri)}>
            <strong>{viTri.tenViTri}</strong>
            <span>{NHAN_LOAI_VI_TRI[viTri.loaiViTri]}</span>
          </button>
          {viTri.danhSachCon?.length ? (
            <Cay danhSach={viTri.danhSachCon} chon={chon} />
          ) : null}
        </li>
      ))}
    </ul>
  );
}

function lamPhangCay(danhSach: CayViTri[]) {
  const ketQua: CayViTri[] = [];

  function themNhanh(danhSachCon: CayViTri[]) {
    danhSachCon.forEach((viTri) => {
      ketQua.push(viTri);
      if (viTri.danhSachCon) themNhanh(viTri.danhSachCon);
    });
  }

  themNhanh(danhSach);
  return ketQua;
}

export default function TrangViTri() {
  const [danhSach, datDanhSach] = useState<CayViTri[]>([]);
  const [dangTai, datDangTai] = useState(true);
  const [loi, datLoi] = useState("");
  const [dangMo, datDangMo] = useState(false);
  const [viTriDangSua, datViTriDangSua] = useState<CayViTri | null>(null);
  const [tenViTri, datTenViTri] = useState("");
  const [loaiViTri, datLoaiViTri] = useState<LoaiViTri>("NHA_MAY");
  const [viTriChaId, datViTriChaId] = useState<number | null>(null);
  const [moTa, datMoTa] = useState("");
  const [loiForm, datLoiForm] = useState("");
  const [dangXuLy, datDangXuLy] = useState(false);
  const [thongBao, datThongBao] = useState("");

  function taiCay() {
    datDangTai(true);
    datLoi("");

    void layCayViTri()
      .then(datDanhSach)
      .catch((loiTai: LoiHttp) => datLoi(loiTai.message))
      .finally(() => datDangTai(false));
  }

  useEffect(() => {
    taiCay();
  }, []);

  function moForm(viTri?: CayViTri) {
    datViTriDangSua(viTri || null);
    datTenViTri(viTri?.tenViTri || "");
    datLoaiViTri(viTri?.loaiViTri || "NHA_MAY");
    datViTriChaId(viTri?.viTriCha?.id || null);
    datMoTa(viTri?.moTa || "");
    datLoiForm("");
    datDangMo(true);
  }

  async function luu(suKien: FormEvent) {
    suKien.preventDefault();

    if (!tenViTri.trim()) {
      datLoiForm("Tên vị trí không được để trống.");
      return;
    }

    if (viTriDangSua?.id === viTriChaId) {
      datLoiForm("Vị trí cha không hợp lệ.");
      return;
    }

    if (loaiViTri !== "NHA_MAY" && !viTriChaId) {
      datLoiForm("Vui lòng chọn vị trí cha.");
      return;
    }

    datDangXuLy(true);

    try {
      const duLieu = {
        tenViTri: tenViTri.trim(),
        loaiViTri,
        viTriChaId: viTriChaId || null,
        moTa: moTa.trim() || undefined,
      };

      if (viTriDangSua) {
        await capNhatViTri(viTriDangSua.id, duLieu);
      } else {
        await themViTri(duLieu);
      }

      datDangMo(false);
      datThongBao("Cập nhật vị trí thành công.");
      taiCay();
    } catch (loiLuu) {
      datLoiForm((loiLuu as LoiHttp).message);
    } finally {
      datDangXuLy(false);
    }
  }

  const danhSachPhang = lamPhangCay(danhSach);
  const loaiViTriCha: Partial<Record<LoaiViTri, LoaiViTri>> = {
    XUONG: "NHA_MAY",
    DAY_CHUYEN: "XUONG",
    KHU_VUC: "DAY_CHUYEN",
  };
  const danhSachIdCon = new Set(
    viTriDangSua ? lamPhangCay(viTriDangSua.danhSachCon || []).map((viTri) => viTri.id) : [],
  );
  const danhSachViTriChaHopLe = danhSachPhang.filter(
    (viTri) =>
      viTri.loaiViTri === loaiViTriCha[loaiViTri] &&
      viTri.id !== viTriDangSua?.id &&
      !danhSachIdCon.has(viTri.id),
  );

  return (
    <>
      <section className="thanh-cong-cu">
        <button className="nut nut-chinh" onClick={() => moForm()}>
          Thêm vị trí
        </button>
      </section>

      {thongBao && <div className="thong-bao thanh-cong">{thongBao}</div>}

      <section className="the-noi-dung">
        <header className="dau-hop-thoai">
          <h2>Cây vị trí</h2>
        </header>

        {dangTai ? (
          <div className="trang-thai-du-lieu">
            <span className="vong-xoay" />
            Đang tải...
          </div>
        ) : loi ? (
          <div className="trang-thai-du-lieu">
            <p className="tieu-de-loi">{loi}</p>
            <button className="nut nut-phu" onClick={taiCay}>
              Thử lại
            </button>
          </div>
        ) : danhSach.length ? (
          <Cay danhSach={danhSach} chon={moForm} />
        ) : (
          <div className="trang-thai-du-lieu">
            <p>Chưa có vị trí.</p>
          </div>
        )}
      </section>

      {dangMo && (
        <div className="lop-phu">
          <section className="hop-thoai">
            <header className="dau-hop-thoai">
              <h2>{viTriDangSua ? "Sửa vị trí" : "Thêm vị trí"}</h2>
              <button
                className="nut-dong"
                type="button"
                onClick={() => datDangMo(false)}
                aria-label="Đóng"
              >
                ×
              </button>
            </header>

            <form className="bieu-mau bieu-mau-them" onSubmit={luu}>
              {loiForm && <div className="thong-bao loi">{loiForm}</div>}

              <div className="nhom-truong">
                <label htmlFor="ten-vi-tri">
                  Tên vị trí <em>*</em>
                </label>
                <input
                  id="ten-vi-tri"
                  value={tenViTri}
                  onChange={(suKien) => {
                    datTenViTri(suKien.target.value);
                    datLoiForm("");
                  }}
                />
              </div>

              <div className="nhom-truong">
                <label htmlFor="loai-vi-tri">
                  Loại vị trí <em>*</em>
                </label>
                <select
                  id="loai-vi-tri"
                  value={loaiViTri}
                  onChange={(suKien) => {
                    const loaiMoi = suKien.target.value as LoaiViTri;
                    datLoaiViTri(loaiMoi);

                    const viTriChaDangChon = danhSachPhang.find(
                      (viTri) => viTri.id === viTriChaId,
                    );
                    if (
                      !viTriChaDangChon ||
                      viTriChaDangChon.loaiViTri !== loaiViTriCha[loaiMoi]
                    ) {
                      datViTriChaId(null);
                    }
                  }}
                >
                  {DANH_SACH_LOAI_VI_TRI.map((loai) => (
                    <option key={loai} value={loai}>
                      {NHAN_LOAI_VI_TRI[loai]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="nhom-truong">
                <label htmlFor="vi-tri-cha">Vị trí cha</label>
                <select
                  id="vi-tri-cha"
                  value={viTriChaId || ""}
                  disabled={loaiViTri === "NHA_MAY"}
                  required={loaiViTri !== "NHA_MAY"}
                  onChange={(suKien) =>
                    datViTriChaId(
                      suKien.target.value ? Number(suKien.target.value) : null,
                    )
                  }
                >
                  <option value="">
                    {loaiViTri === "NHA_MAY" ? "Không có" : "Chọn vị trí cha"}
                  </option>
                  {danhSachViTriChaHopLe.map((viTri) => (
                    <option key={viTri.id} value={viTri.id}>
                      {viTri.tenViTri}
                    </option>
                  ))}
                </select>
              </div>

              <div className="nhom-truong">
                <label htmlFor="mo-ta-vi-tri">Mô tả</label>
                <input
                  id="mo-ta-vi-tri"
                  value={moTa}
                  onChange={(suKien) => datMoTa(suKien.target.value)}
                />
              </div>

              <footer className="chan-hop-thoai">
                <button
                  type="button"
                  className="nut nut-phu"
                  onClick={() => datDangMo(false)}
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
      )}
    </>
  );
}
