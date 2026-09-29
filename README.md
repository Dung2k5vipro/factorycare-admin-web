# Admin_hethong

Frontend Admin cho he thong quan ly su co va bao tri thiet bi.

## Cong nghe

- Next.js
- TypeScript
- App Router
- Tailwind CSS
- ESLint

## Cau truc chinh

- `src/app`: routing, layout va page cua Next.js App Router.
- `src/components`: component giao dien dung lai.
- `src/services`: noi dat cac ham goi REST API sau nay.
- `src/hooks`: custom React hooks.
- `src/types`: TypeScript interfaces/types.
- `src/utils`: ham tien ich.
- `src/constants`: hang so dung chung.

## Lenh co ban

```bash
npm run dev
npm run build
npm run lint
```

Khi chay `npm run dev`, giao dien admin mo tai `http://localhost:3001`.
Backend tiep tuc chay tai `http://localhost:3000`; dia chi API co the cau hinh
bang bien `NEXT_PUBLIC_API_BASE_URL` (xem `.env.example`).
