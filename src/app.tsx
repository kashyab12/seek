import { createRoot } from 'react-dom/client';
import { SearchButton } from '@/components/ui/searchbutton';

const root = createRoot(document.getElementById("app"));
root.render(<SearchButton/>);