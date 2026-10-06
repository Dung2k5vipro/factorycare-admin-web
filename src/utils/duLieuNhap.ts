export function chiGiuChuSo(giaTri: string, doDaiToiDa?: number) {
  const chuoiChuSo = giaTri.replace(/\D/g, "");

  return doDaiToiDa === undefined
    ? chuoiChuSo
    : chuoiChuSo.slice(0, doDaiToiDa);
}
