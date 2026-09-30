import { createRoot } from 'react-dom/client';
import { App } from './shell/App';
import { createWorkspaceStore } from './core/workspace';
import { preparePilot } from './adapters/local-project';
import 'dockview-react/dist/styles/dockview.css';
import './design/tokens.css';
import './design/interface.css';
const store = createWorkspaceStore(await preparePilot());
createRoot(document.getElementById('root')!).render(<App store={store} />);
