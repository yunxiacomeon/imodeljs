/*---------------------------------------------------------------------------------------------
* Copyright (c) 2019 Bentley Systems, Incorporated. All rights reserved.
* Licensed under the MIT License. See LICENSE.md in the project root for license terms.
*--------------------------------------------------------------------------------------------*/
/** @module Utilities */

/** Describes disabled resize handles.
 * @beta
 */
export enum DisabledResizeHandles {
  None = 0,
  Left = 1 << 0,
  Top = 1 << 1,
  Right = 1 << 2,
  Bottom = 1 << 3,
}

/** @internal */
export class DisabledResizeHandlesHelpers {
  public static isBottomDisabled(flags: DisabledResizeHandles) {
    return (DisabledResizeHandles.Bottom === (flags & DisabledResizeHandles.Bottom));
  }

  public static isLeftDisabled(flags: DisabledResizeHandles) {
    return (DisabledResizeHandles.Left === (flags & DisabledResizeHandles.Left));
  }

  public static isRightDisabled(flags: DisabledResizeHandles) {
    return (DisabledResizeHandles.Right === (flags & DisabledResizeHandles.Right));
  }

  public static isTopDisabled(flags: DisabledResizeHandles) {
    return (DisabledResizeHandles.Top === (flags & DisabledResizeHandles.Top));
  }
}
