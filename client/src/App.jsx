import { Outlet } from 'react-router-dom';
import Footer from './components/Footer';

export default function App() {
  return (
    <div>
      <Outlet />
      <Footer />
    </div>
  );
};