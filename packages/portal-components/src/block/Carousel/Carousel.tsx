import { css, cx } from 'emotion';
import * as React from 'react';
import { FunctionComponent, useEffect, useRef } from 'react';
import Picture from '../../elements/Picture';
import CarouselLib from './lib';
import { StyleFix } from '../../types';
let ins: any = null;
let timer: any = null;

export interface CarouselProps extends StyleFix {
  /**
   * 启动延时
   */
  delay?: number;
  /**
   * 动画间隔
   */
  duration?: number;
  /**
   * 资源名
   */
  dataSource?: Array<string>;
  /**
   * 渲染函数
   */
  renderSlide?: (item: string, index: number) => React.ReactNode;
}

export const Carousel: FunctionComponent<CarouselProps> = ({
  delay = 200,
  duration = 6000,
  dataSource = [],
  renderSlide,
  className,
  style
}) => {
  const wrapperRef = useRef(null);
  const navRef = useRef(null);
  const render = (imgSrc: string) => (
    <Picture
      key={imgSrc}
      className={cx(
        css`
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          z-index: 0;
        `,
        'portal-carousel-slide'
      )}
      source={imgSrc}
    ></Picture>
  );
  const _renderSlide = renderSlide || render;
  useEffect(() => {
    timer = setTimeout(() => {
      ins = new CarouselLib({
        container: wrapperRef.current!,
        duration,
        nav: navRef.current!
      }).init();
    }, delay);
    return () => {
      ins && ins.destroy();
      clearTimeout(timer);
    };
  }, [delay, duration, dataSource.length]);
  const items = dataSource.map(_renderSlide);
  return (
    <div
      style={style}
      className={cx(
        css`
          width: 100%;
          height: 100vh;
          position: relative;
          top: 0;
          left: 0;
          overflow: hidden;
        `,
        'portal-carousel',
        className
      )}
    >
      <div
        className={cx(
          css`
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            z-index: 0;
          `,
          'portal-carousel-container'
        )}
      >
        <div ref={wrapperRef} className="portal-carousel-wrappr">
          {items}
        </div>
        <div
          ref={navRef}
          className={cx(
            css`
              position: absolute;
              bottom: 5%;
              width: 100%;
              left: 0;
              text-align: center;
              & > .portal-carousel-nav-item.active {
                background-color: red;
              }
            `,
            'portal-carousel-nav'
          )}
        >
          {dataSource.map((imgSrc) => (
            <i
              className={cx(
                css`
                  display: inline-block;
                  width: 27px;
                  height: 24px;
                  margin: 0 5px;
                  line-height: 3px;
                  text-align: center;
                  vertical-align: middle;
                  cursor: pointer;
                  background-color: #fff;
                  border-radius: 50%;
                `,
                'portal-carousel-nav-item'
              )}
              key={imgSrc}
            ></i>
          ))}
        </div>
      </div>
    </div>
  );
};

Carousel.defaultProps = {
  delay: 200,
  duration: 6000
};
