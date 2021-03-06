/*---------------------------------------------------------------------------------------------
* Copyright (c) 2019 Bentley Systems, Incorporated. All rights reserved.
* Licensed under the MIT License. See LICENSE.md in the project root for license terms.
*--------------------------------------------------------------------------------------------*/
/** @module Breadcrumb */

import * as React from "react";

import { getDisplayName } from "@bentley/ui-core";
import { DropTargetArguments, DragSourceArguments, DropTargetProps, DragSourceProps } from "../../../dragdrop/DragDropDef";
import { withTableDragDrop, TableDropTargetProps } from "../../../table/hocs/withDragDrop";
import { Table, TableProps } from "../../../table/component/Table";
import { BreadcrumbDetailsProps } from "../BreadcrumbDetails";
import { TableDataProvider } from "../../../table/TableDataProvider";
import { TreeNodeItem } from "../../../tree/TreeDataProvider";

/**
 * Type for drag and drop,
 * @beta
 */
export type BreadcrumbDetailsDragDropType = {} | TreeNodeItem | TableDataProvider;

/**
 * Props that are injected to the HOC component.
 * @beta
 */
export interface BreadcrumbDetailsDragDropProps<DragDropObject = any> {
  dragProps?: DragSourceProps<DragDropObject>;
  dropProps?: DropTargetProps<DragDropObject>;
}

/**
 * A HOC component that adds drag and drop functionality to the supplied
 * breadcrumb component.
 * @beta
 */
// tslint:disable-next-line: variable-name naming-convention
export function withBreadcrumbDetailsDragDrop<P extends BreadcrumbDetailsProps, DragDropObject extends BreadcrumbDetailsDragDropType>(BreadcrumbComponent: React.ComponentType<P>): React.ComponentType<P & BreadcrumbDetailsDragDropProps<DragDropObject>> {

  type CombinedProps = P & BreadcrumbDetailsDragDropProps<DragDropObject>;

  // tslint:disable-next-line:variable-name
  return class WithDragAndDrop extends React.Component<CombinedProps> {

    public static get displayName() { return `WithDragDrop(${getDisplayName(BreadcrumbComponent)})`; }
    public createDragProps(_item: TreeNodeItem): DragSourceProps<DragDropObject> {
      if (!this.props.dragProps)
        return {};
      const { onDragSourceBegin, onDragSourceEnd, objectType } = this.props.dragProps as DragSourceProps;
      const dragProps: DragSourceProps = {
        onDragSourceBegin: (args: DragSourceArguments) => {
          const dataProvider = this.props.path.getDataProvider();
          const current = this.props.path.getCurrentNode();
          if (args.dataObject) {
            args.dataObject.parentId = current ? current.id : dataProvider;
          }
          args.parentObject = current || dataProvider;
          return onDragSourceBegin ? onDragSourceBegin(args) : args;
        }, onDragSourceEnd: (args: DragSourceArguments) => {
          // istanbul ignore else
          if (onDragSourceEnd) {
            const dataProvider = this.props.path.getDataProvider();
            const current = this.props.path.getCurrentNode();
            args.parentObject = current || dataProvider;
            onDragSourceEnd(args);
          }
        }, objectType: (data: any) => {
          // istanbul ignore else
          if (objectType) {
            if (typeof objectType === "function") {
              if (data && typeof data === "object") {
                const dataProvider = this.props.path.getDataProvider();
                const current = this.props.path.getCurrentNode();
                data.parentId = current ? current.id : dataProvider;
              }
              return objectType(data);
            } else
              return objectType;
          } else return "";
        },
      };
      return dragProps;
    }

    public createDropProps(_item: TreeNodeItem, children: TreeNodeItem[]): DropTargetProps<DragDropObject> {
      if (!this.props.dropProps)
        return {};

      const { onDropTargetOver, onDropTargetDrop, canDropTargetDrop, objectTypes } = this.props.dropProps as DropTargetProps;

      const dropProps: TableDropTargetProps = {
        canDropOn: true,
        onDropTargetOver: (args: DropTargetArguments) => {
          // istanbul ignore else
          if (onDropTargetOver) {
            const dataProvider = this.props.path.getDataProvider();
            const current = this.props.path.getCurrentNode();
            args.dropLocation = current || dataProvider;
            if (children && args.dropRect && args.row !== undefined) {
              const relativeY = (args.clientOffset.y - args.dropRect.top) / args.dropRect.height;
              if (relativeY >= 1 / 3 && relativeY < 2 / 3) {
                const rowNum = args.row;
                args.row = undefined;
                args.dropLocation = children[rowNum];
              }
            }
            onDropTargetOver(args);
          }
        }, onDropTargetDrop: (args: DropTargetArguments) => {
          const dataProvider = this.props.path.getDataProvider();
          const current = this.props.path.getCurrentNode();
          args.dropLocation = current || dataProvider;
          if (children && args.dropRect && args.row !== undefined) {
            const relativeY = (args.clientOffset.y - args.dropRect.top) / args.dropRect.height;
            if (relativeY >= 1 / 3 && relativeY < 2 / 3) {
              const rowNum = args.row;
              args.row = undefined;
              args.dropLocation = children[rowNum];
            }
          }
          return onDropTargetDrop ? onDropTargetDrop(args) : args;
        }, canDropTargetDrop: (args: DropTargetArguments) => {
          const dataProvider = this.props.path.getDataProvider();
          const current = this.props.path.getCurrentNode();
          args.dropLocation = current || dataProvider;
          return canDropTargetDrop ? canDropTargetDrop(args) : true;
        }, objectTypes,
      };
      return dropProps;
    }
    // tslint:disable-next-line:naming-convention
    private renderTable = (props: TableProps, node: TreeNodeItem, children: TreeNodeItem[]): React.ReactNode => {
      const DDTable = withTableDragDrop<TableProps, DragDropObject>(Table); // tslint:disable-line:variable-name
      return (
        <DDTable
          {...props}
          dragProps={this.createDragProps(node)}
          dropProps={this.createDropProps(node, children)} />
      );
    }

    public render() {
      const { dragProps, dropProps, renderContent, ...breadcrumbProps } = this.props as any;
      return (
        <BreadcrumbComponent {...breadcrumbProps}
          renderTable={this.renderTable} />
      );
    }
  };
}
