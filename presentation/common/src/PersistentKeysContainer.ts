/*---------------------------------------------------------------------------------------------
* Copyright (c) 2019 Bentley Systems, Incorporated. All rights reserved.
* Licensed under the MIT License. See LICENSE.md in the project root for license terms.
*--------------------------------------------------------------------------------------------*/
/** @module Core */

import { Id64String } from "@bentley/bentleyjs-core";
import { NodeKey } from "./hierarchy/Key";

/**
 * Persistent data structure that holds identity information
 * for models, elements and nodes.
 *
 * @public
 */
export interface PersistentKeysContainer {
  /** Model IDs */
  models: Id64String[];
  /** Element IDs */
  elements: Id64String[];
  /** Node keys */
  nodes: NodeKey[];
}
