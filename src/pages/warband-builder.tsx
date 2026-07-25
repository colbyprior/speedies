import { useEffect } from 'react';

export default function WarbandBuilderRedirect() {
  useEffect(() => {
    window.location.replace('/builder/');
  }, []);
  return null;
}
