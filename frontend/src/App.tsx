/*
 * src/App.tsx
 * 
 * Holds the main app build instructions
 */

import { useGuide } from "./hooks/useGuide";
import { useSelection } from "./hooks/useSelection";
import { TwoPanel } from "./components/layout/TwoPanel";
import { GuideTree } from "./components/guide/GuideTree";
import { DetailPanel } from "./components/detail/DetailPanel";


function App() {
    const { guide, loading, error } = useGuide();
    const { selection, selectTask, selectSection } = useSelection();

    const selectedId = selection?.item.id ?? null;

    // note: styling details here are temporary
    if (loading) return <p style={{ padding: "2rem" }}>Loading guide...</p>;
    if (error) return <p style={{ padding: "2rem", color: "red" }}>Error: {error}</p>;
    if (!guide) return <p style={{ padding: "2rem" }}>No guide found.</p>;

    return (
        <TwoPanel
            left={
                <GuideTree
                    guide={guide}
                    selectedId={selectedId}
                    onSelectTask={selectTask}
                    onSelectSection={selectSection}
                />
            }
            right={
                <DetailPanel selection={selection} />
            }
        />
    );
}

export default App;