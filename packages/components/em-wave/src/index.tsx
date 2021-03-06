import { PropsWithChildren, cloneElement, Component } from 'react';
import { findDOMNode } from 'react-dom';

export interface WaveProps {
  children: JSX.Element;
}

function isUnusedAble(node: HTMLElement): boolean {
  const unUsed =
    !node ||
    !node.getAttribute ||
    node.getAttribute('disabled') ||
    node.className.indexOf('disabled') >= 0;
  return !!unUsed;
}
function isIgnoreElement(node: HTMLElement) {
  const ignoreEl = ['INPUT'];
  return ignoreEl.includes(node.tagName);
}
function isHidden(node: HTMLElement) {
  return node.offsetParent === null;
}
function getWaveColor(node: HTMLElement) {
  const cssStylesheet = getComputedStyle(node);
  return (
    cssStylesheet.getPropertyValue('background-color') ||
    cssStylesheet.getPropertyValue('border-color')
  );
}
/**
 * 1. 直接操作DOM
 * 2. 传入的函数组件可能不提供Ref转发
 */

export default class Wave extends Component {
  waveColor = '';
  internalClickTimer = -1;
  pseudoStyleEl!: HTMLStyleElement;
  attributeName = this.getAttributeName();
  private instance?: {
    cancel: () => void;
  };
  getAttributeName() {
    // TODO 前缀从上下文中获取
    return 'em-click-animating';
  }
  componentDidMount() {
    const node = findDOMNode(this) as HTMLElement;
    this.instance = this.bindAnimationEvent(node);
  }
  onClick(node: HTMLElement, waveColor: string) {
    const attributeName = this.attributeName;
    node.setAttribute(attributeName, 'true');
    const animationSelector = `[${attributeName}='true']::after{
    --click-wave-color: ${waveColor};
    }
    `;
    const pseudoStyleEl = this.pseudoStyleEl || document.createElement('style');
    const body = document.body;
    pseudoStyleEl.innerText = animationSelector;
    if (!body.contains(pseudoStyleEl)) {
      body.append(pseudoStyleEl);
    }
    this.pseudoStyleEl = pseudoStyleEl;
    ['transition', 'animation'].forEach((name) => {
      node.addEventListener(`${name}start`, this.onTransitionStart);
      node.addEventListener(`${name}end`, this.onTransitionEnd);
    });
  }
  onTransitionStart = (e: any) => {
    console.log('xxx');
  };
  onTransitionEnd = (e: any) => {
    if (!e || e.animationName !== 'fadeEffect') {
      return;
    }
    this.resetEffect(e.target);
  };
  bindAnimationEvent = (node: HTMLElement) => {
    if (isUnusedAble(node)) return;
    const onClick = (e: MouseEvent) => {
      if (
        isIgnoreElement(e.target as HTMLElement) ||
        isHidden(e.target as HTMLElement)
      ) {
        return;
      }
      this.resetEffect(node);
      const waveColor = (this.waveColor = getWaveColor(node));
      this.onClick(node, waveColor);
    };
    node.addEventListener('click', onClick, true);
    return {
      cancel: () => {},
    };
  };
  resetEffect(node: HTMLElement) {
    node.setAttribute(this.attributeName, 'false');
    if (this.pseudoStyleEl) {
      this.pseudoStyleEl.innerHTML = '';
    }
    ['transition', 'animation'].forEach((name) => {
      node.removeEventListener(`${name}start`, this.onTransitionStart);
      node.removeEventListener(`${name}end`, this.onTransitionEnd);
    });
  }
  renderWave() {
    const { children } = this.props;
    return children;
  }
  render() {
    return this.renderWave();
  }
}
