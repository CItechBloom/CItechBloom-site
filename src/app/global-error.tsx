"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ja">
      <body
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          fontFamily: "sans-serif",
          background: "#fdf8f2",
          color: "#2d2d2d",
          padding: "24px",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "12px" }}>
          予期しないエラーが発生しました
        </h1>
        <p style={{ color: "#666", marginBottom: "24px" }}>
          ご不便をおかけして申し訳ありません。
        </p>
        <button
          onClick={reset}
          style={{
            padding: "10px 24px",
            background: "#c9a84c",
            color: "white",
            border: "none",
            borderRadius: "9999px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          もう一度試す
        </button>
      </body>
    </html>
  );
}
