import { Navigate, useLocation } from 'react-router-dom';

// /contenthub used to be its own page; its content now lives on Home. Old
// links/bookmarks (including deep ones like /contenthub#guide) still work —
// they land on the same section, just on "/" instead.
export function RedirectToHome() {
  const { hash } = useLocation();
  return <Navigate to={`/${hash}`} replace />;
}
