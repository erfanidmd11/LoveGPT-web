import { useNavigate as useRouterNavigate } from 'react-router-dom';

/**
 * Custom Hook for navigation abstraction between React Router v5 (`useHistory`) and v6 (`useNavigate`).
 * This utility hook will allow compatibility across the codebase, making the transition easier.
 */
const useCustomNavigate = () => {
  const navigate = useRouterNavigate();

  // Wrapper around navigate for uniform navigation logic
  const customNavigate = (path: string, options?: { replace?: boolean }) => {
    if (options?.replace) {
      navigate(path, { replace: true }, { replace: true });
    } else {
      navigate(path, { replace: true });
    }
  };

  return customNavigate;
};

export default useCustomNavigate;
