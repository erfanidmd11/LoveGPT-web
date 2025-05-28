import { useNavigate as useRouterNavigate } from 'react-router-dom';

/**
 * Custom Hook for navigation abstraction using React Router v6.
 * Provides a consistent interface for navigation with optional replace logic.
 */
const useCustomNavigate = () => {
  const navigate = useRouterNavigate();

  const customNavigate = (path: string, options?: { replace?: boolean }) => {
    if (options?.replace) {
      navigate(path, { replace: true });
    } else {
      navigate(path);
    }
  };

  return customNavigate;
};

export default useCustomNavigate;
