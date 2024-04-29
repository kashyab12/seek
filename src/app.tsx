import { createRoot } from 'react-dom/client';
import { SearchWindow } from './components/ui/searchwindow';

const root = createRoot(document.getElementById("app"));
root.render(<SearchWindow/>);