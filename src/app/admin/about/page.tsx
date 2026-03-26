import { getAboutSections } from "@/app/admin/_actions/about";
import { AboutEditor } from "./_components/AboutEditor";

export default async function AdminAboutPage() {
  const result = await getAboutSections();

  if (!result.success) {
    return (
      <p className="text-red-600 text-sm">
        Aboutセクションの取得に失敗しました: {result.error}
      </p>
    );
  }

  return <AboutEditor initialSections={result.data} />;
}
