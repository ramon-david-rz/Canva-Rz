import { createRoot } from 'react-dom/client';
import { App } from './shell/App';
import 'dockview-react/dist/styles/dockview.css';
import './design/tokens.css';
import './design/interface.css';

createRoot(document.getElementById('root')!).render(<App />);
