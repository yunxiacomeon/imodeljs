/*---------------------------------------------------------------------------------------------
* Copyright (c) 2019 Bentley Systems, Incorporated. All rights reserved.
* Licensed under the MIT License. See LICENSE.md in the project root for license terms.
*--------------------------------------------------------------------------------------------*/
/** @module Message */

import * as classnames from "classnames";
import * as React from "react";
import { CommonProps, NoChildrenProps } from "@bentley/ui-core";
import { Css } from "../../utilities/Css";
import { Status, StatusHelpers } from "./Status";
import "./Progress.scss";

/** Properties of [[MessageProgress]] component.
 * @beta
 */
export interface ProgressProps extends CommonProps, NoChildrenProps {
  /** Progress of this progress bar. Range from 0 to 100 (percentage). */
  progress: number;
  /** Progress bar status. */
  status: Status;
}

/** Progress bar component used in [[Message]] component.
 * @beta
 */
export class MessageProgress extends React.PureComponent<ProgressProps> {
  public render() {
    const className = classnames(
      "nz-footer-message-progress",
      StatusHelpers.getCssClassName(this.props.status),
      this.props.className);

    return (
      <div
        className={className}
        style={this.props.style}
      >
        <div className="nz-progress">
          <div
            className="nz-progress-bar"
            style={{
              width: Css.toPercentage(this.props.progress),
            }}
          >
            <div className="nz-progress-bar-tip"></div>
          </div>
        </div>
      </div>
    );
  }
}
