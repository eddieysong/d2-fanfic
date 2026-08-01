import { LibraryHome } from "../components/LibraryHome";
import { collections, library, totalWords } from "../lib/library";

export default function Home() {
  return <LibraryHome entries={library} collections={collections} totalWords={totalWords} />;
}
