/**
 * Z-Index Layering System
 * 
 * Defines consistent z-index values across the application to prevent
 * stacking context conflicts and ensure predictable layering.
 * 
 * Usage:
 * import { Z_INDEX } from '@/constants/zIndex';
 * 
 * zIndex: Z_INDEX.HEADER
 */
export const Z_INDEX = {
  /** Base content layer - default for all content */
  BASE: 0,
  
  /** Header components - appears above base content */
  HEADER: 50,
  
  /** Header action buttons - appears above header */
  HEADER_ACTIONS: 100,
  
  /** Dropdown menus, tooltips, and floating elements */
  DROPDOWN: 500,
  
  /** Modal overlays, drawers, and full-screen overlays */
  OVERLAY: 1000,
} as const;

/**
 * Type for z-index values
 */
export type ZIndexValue = typeof Z_INDEX[keyof typeof Z_INDEX];

