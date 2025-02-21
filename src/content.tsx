import { createRoot } from 'react-dom/client';
import HelloWorld from './components/HelloWorld';
const mountNode = document.createElement('div');
mountNode.id = 'tailwind-react-google-extension-boilerplate';
document.body.appendChild(mountNode);

const root = createRoot(mountNode);
root.render(<HelloWorld />);
