/*---------------------------------------------------------------------------------------------
* Copyright (c) 2019 Bentley Systems, Incorporated. All rights reserved.
* Licensed under the MIT License. See LICENSE.md in the project root for license terms.
*--------------------------------------------------------------------------------------------*/
/** @module Item */

import * as React from "react";

import { ContextSubMenu, UiError, ContextMenuItem } from "@bentley/ui-core";

import { ActionButtonItemDef } from "./ActionButtonItemDef";
import { ItemDefBase } from "./ItemDefBase";
import { UiFramework } from "../UiFramework";
import { CommandItemDef } from "./CommandItemDef";
import { MenuItemProps } from "./ItemProps";

/** Menu Item
 * @alpha
 */
export class MenuItem extends ItemDefBase {

  private _id = "";
  private _actionItem?: ActionButtonItemDef;
  private _submenu: MenuItem[];
  private _onSelection?: () => void;

  /** onSelection is an optional parameter typically supplied to allow menu parent to close context menu when a menu item is selected. */
  constructor(props: MenuItemProps, onSelection?: () => void) {
    super(props);

    this._id = props.id;
    this._submenu = new Array<MenuItem>();
    this._onSelection = onSelection;
    if (props.item) {
      this._actionItem = new CommandItemDef(props.item);

      // Copy over icon, label & tooltip from the item
      if (!this.iconSpec)
        this.iconSpec = this._actionItem.iconSpec;
      if (!this.label)
        this.setLabel(this._actionItem.label);
    } else if (props.submenu) {
      props.submenu.forEach((childProps: MenuItemProps) => {
        const childItem = new MenuItem(childProps);
        this._submenu.push(childItem);
      });
    } else {
      throw new UiError(UiFramework.loggerCategory(this), `Either 'item' or 'submenu' must be specified for '${props.id}'.`);
    }
  }

  public get id(): string { return this._id; }

  public get submenu(): MenuItem[] {
    return this._submenu;
  }

  public get actionItem(): ActionButtonItemDef | undefined {
    return this._actionItem;
  }

  public itemPicked(): void {
    setTimeout(() => {
      // istanbul ignore else
      if (this._actionItem)
        this._actionItem.execute();
    });
    if (this._onSelection)
      this._onSelection();
  }

}

/** Menu Item helper methods
 * @alpha
 */
export class MenuItemHelpers {

  public static createMenuItems(itemPropsList: MenuItemProps[], onSelection?: () => void): MenuItem[] {
    const menuItems = new Array<MenuItem>();
    itemPropsList.forEach((itemProps: MenuItemProps) => {
      menuItems.push(new MenuItem(itemProps, onSelection));
    });
    return menuItems;
  }

  public static createMenuItemNodes(itemList: MenuItem[]): React.ReactNode[] {
    const itemNodes: React.ReactNode[] = [];

    itemList.forEach((item: MenuItem, index: number) => {
      const reactItem = this.createMenuItemNode(item, index);
      // istanbul ignore else
      if (reactItem)
        itemNodes.push(reactItem);
    });

    return itemNodes;
  }

  private static createMenuItemNode(item: MenuItem, index: number): React.ReactNode {
    let node: React.ReactNode = null;
    const label = item.label;
    const iconSpec = item.iconSpec;

    if (item.actionItem) {
      const sel = () => item.itemPicked();
      node = (
        <ContextMenuItem key={index}
          onSelect={sel}
          icon={iconSpec} >
          {label}
        </ContextMenuItem>
      );
    } else if (item.submenu && item.submenu.length > 0) {
      const items = this.createMenuItemNodes(item.submenu);

      node = (
        <ContextSubMenu key={index} icon={iconSpec} label={label}>
          {items}
        </ContextSubMenu>
      );
    }

    return node;
  }
}