export interface PhanHoiApi<T> {
  thanhCong: boolean;
  thongBao?: string;
  duLieu: T;
}

export class LoiHttp extends Error {
  constructor(
    public readonly maTrangThai: number,
    public readonly thongBaoNguoiDung: string,
  ) {
    super(thongBaoNguoiDung);
    this.name = "LoiHttp";
  }
}
