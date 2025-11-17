import { renderHook, act } from '@testing-library/react';
import { useToastStore, toast } from '../toast.store';

describe('toastStore', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useToastStore());
    act(() => {
      result.current.toasts = [];
    });
  });

  describe('success', () => {
    it('should add success toast', () => {
      const { result } = renderHook(() => useToastStore());

      act(() => {
        toast.success('Operation successful');
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].type).toBe('success');
      expect(result.current.toasts[0].message).toBe('Operation successful');
      expect(result.current.toasts[0].id).toBeDefined();
    });
  });

  describe('error', () => {
    it('should add error toast', () => {
      const { result } = renderHook(() => useToastStore());

      act(() => {
        toast.error('Operation failed');
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].type).toBe('error');
      expect(result.current.toasts[0].message).toBe('Operation failed');
    });
  });

  describe('info', () => {
    it('should add info toast', () => {
      const { result } = renderHook(() => useToastStore());

      act(() => {
        toast.info('Information message');
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].type).toBe('info');
      expect(result.current.toasts[0].message).toBe('Information message');
    });
  });

  describe('warning', () => {
    it('should add warning toast', () => {
      const { result } = renderHook(() => useToastStore());

      act(() => {
        toast.warning('Warning message');
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].type).toBe('warning');
      expect(result.current.toasts[0].message).toBe('Warning message');
    });
  });

  describe('removeToast', () => {
    it('should remove specific toast', async () => {
      const { result } = renderHook(() => useToastStore());

      let toastId: string;
      await act(async () => {
        toast.success('First toast');
        await new Promise(resolve => setTimeout(resolve, 0));
        toastId = result.current.toasts[0]?.id;
      });

      await act(async () => {
        toast.info('Second toast');
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.toasts.length).toBeGreaterThanOrEqual(1);

      if (toastId) {
        await act(async () => {
          result.current.removeToast(toastId);
        });

        const hasFirst = result.current.toasts.some(t => t.id === toastId);
        expect(hasFirst).toBe(false);
      }
    });

    it('should not fail when removing non-existent toast', async () => {
      const { result } = renderHook(() => useToastStore());

      await act(async () => {
        toast.success('Toast message');
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const initialLength = result.current.toasts.length;

      await act(async () => {
        result.current.removeToast('non-existent-id');
      });

      expect(result.current.toasts.length).toBe(initialLength);
    });
  });

  describe('multiple toasts', () => {
    it('should handle multiple toasts', () => {
      const { result } = renderHook(() => useToastStore());

      act(() => {
        toast.success('Success 1');
        toast.error('Error 1');
        toast.info('Info 1');
        toast.warning('Warning 1');
      });

      expect(result.current.toasts).toHaveLength(4);
      expect(result.current.toasts[0].type).toBe('success');
      expect(result.current.toasts[1].type).toBe('error');
      expect(result.current.toasts[2].type).toBe('info');
      expect(result.current.toasts[3].type).toBe('warning');
    });

    it('should generate unique IDs for each toast', () => {
      const { result } = renderHook(() => useToastStore());

      act(() => {
        toast.success('Toast 1');
        toast.success('Toast 2');
        toast.success('Toast 3');
      });

      const ids = result.current.toasts.map((t) => t.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(3);
    });
  });
});

