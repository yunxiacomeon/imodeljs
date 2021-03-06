/*---------------------------------------------------------------------------------------------
* Copyright (c) 2019 Bentley Systems, Incorporated. All rights reserved.
* Licensed under the MIT License. See LICENSE.md in the project root for license terms.
*--------------------------------------------------------------------------------------------*/
/** @module Icon */

import * as classnames from "classnames";
import * as React from "react";
import { CommonProps } from "../utils/Props";
import "./SvgSprite.scss";

/** Properties of [[SvgPath]] component.
 * @public
 */
export interface SvgPathProps extends CommonProps {
  /** Svg graphics paths */
  paths: string[];
  /** Svg viewBox width */
  viewBoxWidth: number;
  /** Svg viewBox height */
  viewBoxHeight: number;
}

/** Svg element wrapper with specified Svg paths.
 * @public
 */
export class SvgPath extends React.PureComponent<SvgPathProps> {
  public render() {
    const className = classnames(
      "core-icons-svgSprite",
      this.props.className,
    );
    const viewBox = "0 0 " + this.props.viewBoxWidth + " " + this.props.viewBoxHeight;

    return (
      <svg className={className} style={this.props.style} width="100%" height="100%" viewBox={viewBox}>
        <g>
          {
            this.props.paths.map((path: string, index: number) => {
              return (
                <path d={path} key={index} />
              );
            })
          }
        </g>
      </svg>
    );
  }
}
