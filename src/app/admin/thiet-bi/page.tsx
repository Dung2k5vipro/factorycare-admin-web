"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import ThemLoaiThietBi from "@/components/thiet-bi/ThemLoaiThietBi";
import ThemThietBi from "@/components/thiet-bi/ThemThietBi";
import {
  capNhatThietBi,
  capNhatTrangThaiThietBi,
  layChiTietThietBi,
  layDanhSachLoaiThietBi,
  layDanhSachLoNhap,
  layDanhSachThietBi,
  layDanhSachViTri,
  layQrThietBi,
} from "@/services/thietBi.service";
import type { LoiHttp } from "@/types/api";
import type {
  DuLieuThemThietBi,
  LoaiThietBi,
  LoNhap,
  ThietBi,
  TrangThaiThietBi,
  ViTri,
} from "@/types/thietBi";
import {
  DANH_SACH_TRANG_THAI_THIET_BI,
  NHAN_TRANG_THAI_THIET_BI,
  kiemTraNgayBaoHanh,
  kiemTraTenThietBi,
} from "@/utils/kiemTraThietBi";

const SO_BAN_GHI_MOI_TRANG = 10;

function dinhDangNgay(ngay?: string | null) {
  return ngay ? new Intl.DateTimeFormat("vi-VN").format(new Date(ngay)) : "—";
}

function layThongBaoLoi(loi: unknown, macDinh: string) {
  return (loi as LoiHttp)?.message || macDinh;
}

export default function TrangThietBi() {
  const [danhSachThietBi, datDanhSachThietBi] = useState<ThietBi[]>([]);
  const [danhSachLoai, datDanhSachLoai] = useState<LoaiThietBi[]>([]);
  const [danhSachViTri, datDanhSachViTri] = useState<ViTri[]>([]);
  const [danhSachLoNhap, datDanhSachLoNhap] = useState<LoNhap[]>([]);
  const [tuKhoaNhap, datTuKhoaNhap] = useState("");
  const [tuKhoaTimKiem, datTuKhoaTimKiem] = useState("");
  const [loaiDangLoc, datLoaiDangLoc] = useState("");
  const [trangThaiDangLoc, datTrangThaiDangLoc] = useState<
    TrangThaiThietBi | ""
  >("");
  const [trangHienTai, datTrangHienTai] = useState(1);
  const [tongSoTrang, datTongSoTrang] = useState(0);
  const [dangTai, datDangTai] = useState(true);
  const [loiTaiDuLieu, datLoiTaiDuLieu] = useState("");
  const [lanTaiLai, datLanTaiLai] = useState(0);
  const [dangMoThem, datDangMoThem] = useState(false);
  const [dangMoLoai, datDangMoLoai] = useState(false);
  const [thietBiDangChon, datThietBiDangChon] = useState<ThietBi | null>(null);
  const [dangTaiChiTiet, datDangTaiChiTiet] = useState(false);
  const [dangSua, datDangSua] = useState(false);
  const [duLieuSua, datDuLieuSua] = useState<Partial<DuLieuThemThietBi>>({});
  const [qr, datQr] = useState<{
    anhQr?: string;
    maQr?: string;
    noiDungQr?: string;
  } | null>(null);
  const [loiChiTiet, datLoiChiTiet] = useState("");
  const [thongBao, datThongBao] = useState("");

  useEffect(() => {
    const thamSo = new URLSearchParams(window.location.search);
    const tuKhoa = thamSo.get("tuKhoa")?.trim().slice(0, 200) || "";
    const trangThai = thamSo.get("trangThai") || "";
    const boDem = window.setTimeout(() => {
      if (tuKhoa) {
        datTuKhoaNhap(tuKhoa);
        datTuKhoaTimKiem(tuKhoa);
      }
      if (DANH_SACH_TRANG_THAI_THIET_BI.includes(trangThai as TrangThaiThietBi)) {
        datTrangThaiDangLoc(trangThai as TrangThaiThietBi);
      }
    }, 0);
    return () => window.clearTimeout(boDem);
  }, []);

  useEffect(() => {
    void layDanhSachLoaiThietBi({ trang: 1, gioiHan: 100 })
      .then((ketQua) => datDanhSachLoai(ketQua.danhSach))
      .catch(() => undefined);
    void layDanhSachViTri()
      .then((ketQua) => datDanhSachViTri(ketQua.danhSach))
      .catch(() => undefined);
    void layDanhSachLoNhap()
      .then((ketQua) => datDanhSachLoNhap(ketQua.danhSach))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    let dangHoatDong = true;
    void layDanhSachThietBi({
      trang: trangHienTai,
      gioiHan: SO_BAN_GHI_MOI_TRANG,
      tuKhoa: tuKhoaTimKiem || undefined,
      loaiThietBiId: loaiDangLoc ? Number(loaiDangLoc) : undefined,
      trangThai: trangThaiDangLoc || undefined,
    })
      .then((ketQua) => {
        if (!dangHoatDong) return;
        datDanhSachThietBi(ketQua.danhSach);
        datTongSoTrang(ketQua.phanTrang?.tongTrang || 0);
      })
      .catch((loi) => {
        if (dangHoatDong) {
          datLoiTaiDuLieu(
            layThongBaoLoi(loi, "Không thể tải danh sách thiết bị."),
          );
        }
      })
      .finally(() => {
        if (dangHoatDong) datDangTai(false);
      });

    return () => {
      dangHoatDong = false;
    };
  }, [lanTaiLai, loaiDangLoc, trangHienTai, trangThaiDangLoc, tuKhoaTimKiem]);

  useEffect(() => {
    const tuKhoaMoi = tuKhoaNhap.trim();
    if (tuKhoaMoi === tuKhoaTimKiem) return;
    const boDem = window.setTimeout(() => {
      datDangTai(true);
      datLoiTaiDuLieu("");
      datTrangHienTai(1);
      datTuKhoaTimKiem(tuKhoaMoi);
    }, 400);
    return () => window.clearTimeout(boDem);
  }, [tuKhoaNhap, tuKhoaTimKiem]);

  function taiLaiDanhSach() {
    datDangTai(true);
    datLoiTaiDuLieu("");
    datLanTaiLai((lanTaiLaiHienTai) => lanTaiLaiHienTai + 1);
  }

  function hienThongBao(noiDung: string) {
    datThongBao(noiDung);
    window.setTimeout(() => datThongBao(""), 3500);
  }

  function xoaBoLoc() {
    datTuKhoaNhap("");
    datTuKhoaTimKiem("");
    datLoaiDangLoc("");
    datTrangThaiDangLoc("");
    datTrangHienTai(1);
    datDangTai(true);
  }

  async function moChiTiet(idThietBi: number) {
    datDangTaiChiTiet(true);
    datThietBiDangChon(null);
    datQr(null);
    datLoiChiTiet("");
    try {
      datThietBiDangChon(await layChiTietThietBi(idThietBi));
    } catch (loi) {
      datLoiChiTiet(layThongBaoLoi(loi, "Không thể tải chi tiết thiết bị."));
    } finally {
      datDangTaiChiTiet(false);
    }
  }

  async function moQr() {
    if (!thietBiDangChon) return;
    try {
      const ketQua = await layQrThietBi(thietBiDangChon.id);
      datQr(ketQua);
    } catch (loi) {
      datLoiChiTiet(layThongBaoLoi(loi, "Không thể tải QR thiết bị."));
    }
  }

  async function doiTrangThai(trangThai: TrangThaiThietBi) {
    if (!thietBiDangChon) return;
    try {
      datThietBiDangChon(
        await capNhatTrangThaiThietBi(thietBiDangChon.id, trangThai),
      );
      hienThongBao("Cập nhật trạng thái thành công.");
      taiLaiDanhSach();
    } catch (loi) {
      datLoiChiTiet(layThongBaoLoi(loi, "Không thể cập nhật trạng thái."));
    }
  }

  function moSua() {
    if (!thietBiDangChon) return;
    datDuLieuSua({
      tenThietBi: thietBiDangChon.tenThietBi,
      loaiThietBiId: thietBiDangChon.loaiThietBiId,
      soSerial: thietBiDangChon.soSerial || "",
      model: thietBiDangChon.model || "",
      hangSanXuat: thietBiDangChon.hangSanXuat || "",
      giaMua: thietBiDangChon.giaMua ?? null,
      ngayBatDauBaoHanh: thietBiDangChon.ngayBatDauBaoHanh || "",
      ngayHetBaoHanh: thietBiDangChon.ngayHetBaoHanh || "",
      moTa: thietBiDangChon.moTa || "",
    });
    datLoiChiTiet("");
    datDangSua(true);
  }

  async function luuSua() {
    if (!thietBiDangChon) return;
    const loiTen = kiemTraTenThietBi(String(duLieuSua.tenThietBi || ""));
    const loiNgay = kiemTraNgayBaoHanh(
      duLieuSua.ngayBatDauBaoHanh,
      duLieuSua.ngayHetBaoHanh,
    );
    if (loiTen || loiNgay) {
      datLoiChiTiet(loiTen || loiNgay);
      return;
    }

    try {
      const ketQua = await capNhatThietBi(thietBiDangChon.id, {
        ...duLieuSua,
        tenThietBi: String(duLieuSua.tenThietBi).trim(),
        soSerial: String(duLieuSua.soSerial || "").trim() || undefined,
        model: String(duLieuSua.model || "").trim() || undefined,
        hangSanXuat: String(duLieuSua.hangSanXuat || "").trim() || undefined,
      });
      datThietBiDangChon(ketQua);
      datDangSua(false);
      hienThongBao("Cập nhật thiết bị thành công.");
      taiLaiDanhSach();
    } catch (loi) {
      datLoiChiTiet(layThongBaoLoi(loi, "Không thể cập nhật thiết bị."));
    }
  }

  const dangLoc = Boolean(tuKhoaTimKiem || loaiDangLoc || trangThaiDangLoc);

  return (
    <>
      <section className="thanh-cong-cu">
        <div className="cum-nut">
          <button className="nut nut-phu" onClick={() => datDangMoLoai(true)}>
            Thêm loại
          </button>
          <button className="nut nut-chinh" onClick={() => datDangMoThem(true)}>
            Thêm thiết bị
          </button>
        </div>
      </section>

      {thongBao && <div className="thong-bao thanh-cong">{thongBao}</div>}

      <section className="the-noi-dung">
        <div className="bo-loc">
          <div className="o-tim-kiem">
            <span aria-hidden="true">⌕</span>
            <input
              value={tuKhoaNhap}
              onChange={(suKien) => datTuKhoaNhap(suKien.target.value)}
              placeholder="Tìm kiếm mã, tên, serial, model"
              aria-label="Tìm kiếm thiết bị"
            />
          </div>

          <select
            value={loaiDangLoc}
            onChange={(suKien) => {
              datTrangHienTai(1);
              datLoaiDangLoc(suKien.target.value);
            }}
            aria-label="Lọc theo loại"
          >
            <option value="">Tất cả loại</option>
            {danhSachLoai.map((loai) => (
              <option key={loai.id} value={loai.id}>
                {loai.tenLoai}
              </option>
            ))}
          </select>

          <select
            value={trangThaiDangLoc}
            onChange={(suKien) => {
              datTrangHienTai(1);
              datTrangThaiDangLoc(suKien.target.value as TrangThaiThietBi | "");
            }}
            aria-label="Lọc theo trạng thái"
          >
            <option value="">Tất cả trạng thái</option>
            {DANH_SACH_TRANG_THAI_THIET_BI.map((trangThai) => (
              <option key={trangThai} value={trangThai}>
                {NHAN_TRANG_THAI_THIET_BI[trangThai]}
              </option>
            ))}
          </select>

          <button
            className="nut nut-phu"
            onClick={xoaBoLoc}
            disabled={!dangLoc}
          >
            Xóa bộ lọc
          </button>
        </div>

        {dangTai && (
          <div className="trang-thai-du-lieu">
            <span className="vong-xoay" />
            Đang tải...
          </div>
        )}

        {!dangTai && loiTaiDuLieu && (
          <div className="trang-thai-du-lieu">
            <p className="tieu-de-loi">{loiTaiDuLieu}</p>
            <button className="nut nut-phu" onClick={taiLaiDanhSach}>
              Thử lại
            </button>
          </div>
        )}

        {!dangTai && !loiTaiDuLieu && danhSachThietBi.length === 0 && (
          <div className="trang-thai-du-lieu">
            <div className="bieu-tuong-rong">⌁</div>
            <p>
              {dangLoc
                ? "Không tìm thấy thiết bị phù hợp."
                : "Chưa có thiết bị."}
            </p>
          </div>
        )}

        {!dangTai && !loiTaiDuLieu && danhSachThietBi.length > 0 && (
          <div className="khung-bang">
            <table>
              <thead>
                <tr>
                  <th>Mã thiết bị</th>
                  <th>Tên thiết bị</th>
                  <th>Loại</th>
                  <th>Model</th>
                  <th>Trạng thái</th>
                  <th>Vị trí</th>
                  <th aria-label="Thao tác" />
                </tr>
              </thead>
              <tbody>
                {danhSachThietBi.map((thietBi) => (
                  <tr
                    key={thietBi.id}
                    className="dong-co-the-chon"
                    onClick={() => void moChiTiet(thietBi.id)}
                  >
                    <td>
                      <strong>{thietBi.maThietBi}</strong>
                    </td>
                    <td>{thietBi.tenThietBi}</td>
                    <td>
                      {thietBi.loaiThietBi?.tenLoai ||
                        danhSachLoai.find(
                          (loai) => loai.id === thietBi.loaiThietBiId,
                        )?.tenLoai ||
                        "—"}
                    </td>
                    <td>{thietBi.model || "—"}</td>
                    <td>
                      <span className="huy-hieu">
                        {NHAN_TRANG_THAI_THIET_BI[thietBi.trangThai] ||
                          thietBi.trangThai}
                      </span>
                    </td>
                    <td>{thietBi.viTri?.tenViTri || "—"}</td>
                    <td>
                      <button
                        className="nut-hanh-dong"
                        onClick={(suKien) => {
                          suKien.stopPropagation();
                          void moChiTiet(thietBi.id);
                        }}
                        aria-label={`Xem ${thietBi.tenThietBi}`}
                      >
                        •••
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!dangTai && !loiTaiDuLieu && tongSoTrang > 0 && (
          <footer className="phan-trang">
            <span>
              Trang {trangHienTai} / {tongSoTrang}
            </span>
            <div>
              <button
                className="nut-trang"
                onClick={() => {
                  datDangTai(true);
                  datTrangHienTai((trang) => trang - 1);
                }}
                disabled={trangHienTai <= 1}
                aria-label="Trang trước"
              >
                ‹
              </button>
              <button className="nut-trang dang-chon">{trangHienTai}</button>
              <button
                className="nut-trang"
                onClick={() => {
                  datDangTai(true);
                  datTrangHienTai((trang) => trang + 1);
                }}
                disabled={trangHienTai >= tongSoTrang}
                aria-label="Trang sau"
              >
                ›
              </button>
            </div>
          </footer>
        )}
      </section>

      <ThemThietBi
        dangMo={dangMoThem}
        dong={() => datDangMoThem(false)}
        thanhCong={() => {
          datDangMoThem(false);
          hienThongBao("Thêm thiết bị thành công.");
          taiLaiDanhSach();
        }}
        danhSachLoai={danhSachLoai}
        danhSachViTri={danhSachViTri}
        danhSachLoNhap={danhSachLoNhap}
      />

      <ThemLoaiThietBi
        dangMo={dangMoLoai}
        dong={() => datDangMoLoai(false)}
        thanhCong={() => {
          datDangMoLoai(false);
          hienThongBao("Thêm loại thiết bị thành công.");
          void layDanhSachLoaiThietBi({ trang: 1, gioiHan: 100 }).then(
            (ketQua) => datDanhSachLoai(ketQua.danhSach),
          );
        }}
      />

      {dangTaiChiTiet && (
        <div className="lop-phu">
          <section className="hop-thoai">
            <div className="trang-thai-du-lieu">
              <span className="vong-xoay" />
              Đang tải...
            </div>
          </section>
        </div>
      )}

      {!dangTaiChiTiet && thietBiDangChon && (
        <div className="lop-phu">
          <section className="hop-thoai hop-thoai-chi-tiet">
            <header className="dau-hop-thoai">
              <h2>{thietBiDangChon.tenThietBi}</h2>
              <button
                className="nut-dong"
                onClick={() => datThietBiDangChon(null)}
                aria-label="Đóng"
              >
                ×
              </button>
            </header>

            <div className="noi-dung-chi-tiet">
              <dl className="luoi-thong-tin">
                <div>
                  <dt>Mã thiết bị</dt>
                  <dd>{thietBiDangChon.maThietBi}</dd>
                </div>
                <div>
                  <dt>Loại</dt>
                  <dd>{thietBiDangChon.loaiThietBi?.tenLoai || "—"}</dd>
                </div>
                <div>
                  <dt>Serial</dt>
                  <dd>{thietBiDangChon.soSerial || "—"}</dd>
                </div>
                <div>
                  <dt>Model</dt>
                  <dd>{thietBiDangChon.model || "—"}</dd>
                </div>
                <div>
                  <dt>Hãng sản xuất</dt>
                  <dd>{thietBiDangChon.hangSanXuat || "—"}</dd>
                </div>
                <div>
                  <dt>Vị trí hiện tại</dt>
                  <dd>{thietBiDangChon.viTri?.tenViTri || "—"}</dd>
                </div>
                <div>
                  <dt>Giá mua</dt>
                  <dd>
                    {thietBiDangChon.giaMua == null
                      ? "—"
                      : new Intl.NumberFormat("vi-VN").format(
                          thietBiDangChon.giaMua,
                        )}
                  </dd>
                </div>
                <div>
                  <dt>Bảo hành</dt>
                  <dd>
                    {dinhDangNgay(thietBiDangChon.ngayBatDauBaoHanh)} –{" "}
                    {dinhDangNgay(thietBiDangChon.ngayHetBaoHanh)}
                  </dd>
                </div>
              </dl>

              {qr && (
                <div className="thong-bao thanh-cong">
                  {qr.anhQr && (
                    <Image
                      src={qr.anhQr}
                      alt={`Mã QR của ${thietBiDangChon.tenThietBi}`}
                      width={180}
                      height={180}
                      unoptimized
                    />
                  )}
                  <div>{qr.noiDungQr || qr.maQr || "QR chưa có dữ liệu."}</div>
                </div>
              )}
              {loiChiTiet && <div className="thong-bao loi">{loiChiTiet}</div>}

              <footer className="chan-chi-tiet">
                <button className="nut nut-phu" onClick={moSua}>
                  Sửa
                </button>
                <button className="nut nut-phu" onClick={() => void moQr()}>
                  Xem QR
                </button>
                <select
                  value={thietBiDangChon.trangThai}
                  onChange={(suKien) =>
                    void doiTrangThai(suKien.target.value as TrangThaiThietBi)
                  }
                  aria-label="Trạng thái thiết bị"
                >
                  <option value={thietBiDangChon.trangThai}>
                    {NHAN_TRANG_THAI_THIET_BI[thietBiDangChon.trangThai]}
                  </option>
                  {DANH_SACH_TRANG_THAI_THIET_BI.filter(
                    (trangThai) => trangThai !== thietBiDangChon.trangThai,
                  ).map((trangThai) => (
                    <option key={trangThai} value={trangThai}>
                      {NHAN_TRANG_THAI_THIET_BI[trangThai]}
                    </option>
                  ))}
                </select>
              </footer>
            </div>
          </section>
        </div>
      )}

      {dangSua && thietBiDangChon && (
        <div className="lop-phu lop-phu-xac-nhan">
          <section className="hop-thoai">
            <header className="dau-hop-thoai">
              <h2>Sửa thiết bị</h2>
              <button
                className="nut-dong"
                onClick={() => datDangSua(false)}
                aria-label="Đóng"
              >
                ×
              </button>
            </header>

            <div className="bieu-mau bieu-mau-them">
              <div className="nhom-truong">
                <label htmlFor="ten-thiet-bi-sua">Tên thiết bị</label>
                <input
                  id="ten-thiet-bi-sua"
                  value={String(duLieuSua.tenThietBi || "")}
                  onChange={(suKien) =>
                    datDuLieuSua((duLieu) => ({
                      ...duLieu,
                      tenThietBi: suKien.target.value,
                    }))
                  }
                />
              </div>
              <div className="nhom-truong">
                <label htmlFor="model-thiet-bi-sua">Model</label>
                <input
                  id="model-thiet-bi-sua"
                  value={String(duLieuSua.model || "")}
                  onChange={(suKien) =>
                    datDuLieuSua((duLieu) => ({
                      ...duLieu,
                      model: suKien.target.value,
                    }))
                  }
                />
              </div>
              <div className="nhom-truong">
                <label htmlFor="hang-san-xuat-sua">Hãng sản xuất</label>
                <input
                  id="hang-san-xuat-sua"
                  value={String(duLieuSua.hangSanXuat || "")}
                  onChange={(suKien) =>
                    datDuLieuSua((duLieu) => ({
                      ...duLieu,
                      hangSanXuat: suKien.target.value,
                    }))
                  }
                />
              </div>
              <div className="nhom-truong">
                <label htmlFor="gia-mua-sua">Giá mua</label>
                <input
                  id="gia-mua-sua"
                  type="number"
                  min="0"
                  value={duLieuSua.giaMua ?? ""}
                  onChange={(suKien) =>
                    datDuLieuSua((duLieu) => ({
                      ...duLieu,
                      giaMua: suKien.target.value
                        ? Number(suKien.target.value)
                        : null,
                    }))
                  }
                />
              </div>

              {loiChiTiet && <div className="thong-bao loi">{loiChiTiet}</div>}

              <footer className="chan-hop-thoai">
                <button
                  className="nut nut-phu"
                  onClick={() => datDangSua(false)}
                >
                  Hủy
                </button>
                <button className="nut nut-chinh" onClick={() => void luuSua()}>
                  Lưu
                </button>
              </footer>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
