// Runtime kecil pengganti mesin template Claude Design.
// AppLogic menulis state secara sinkron (this.state langsung berubah setelah setState),
// jadi Host menyimpan instance logika dan hanya memicu render ulang React.
import React from 'react';

export class DCLogic {
  constructor(props) {
    this.props = props || {};
    this.state = {};
    this.__host = null;
  }
  setState(update, cb) { this.__host && this.__host.__setLogicState(update, cb); }
  forceUpdate() { this.__host && this.__host.forceUpdate(); }
  componentDidMount() {}
  componentDidUpdate() {}
  componentWillUnmount() {}
  renderVals() { return {}; }
}

export function createHost(Logic, View) {
  return class Host extends React.Component {
    constructor(props) {
      super(props);
      this.state = { v: 0, err: null };
      this.logic = new Logic(props);
      this.logic.__host = this;
    }
    static getDerivedStateFromError(e) { return { err: (e && e.message) || String(e) }; }
    componentDidCatch(e, info) { console.error('[kloter] render error', e, info && info.componentStack); }
    __setLogicState(update, cb) {
      const prev = this.logic.state;
      const patch = typeof update === 'function' ? update(prev) : update;
      this.logic.state = { ...prev, ...patch };
      this.setState(s => ({ v: s.v + 1 }), cb);
    }
    componentDidMount() { this.logic.componentDidMount(); }
    componentDidUpdate(prev) { this.logic.props = this.props; this.logic.componentDidUpdate(prev); }
    componentWillUnmount() { this.logic.componentWillUnmount(); }
    render() {
      if (this.state.err) return React.createElement('div', { style: { padding: 24, fontFamily: 'sans-serif' } },
        React.createElement('b', null, 'Terjadi kesalahan tampilan'), React.createElement('pre', { style: { whiteSpace: 'pre-wrap' } }, this.state.err),
        React.createElement('button', { onClick: () => location.reload() }, 'Muat ulang'));
      return React.createElement(View, { v: { ...this.props, ...this.logic.renderVals() } });
    }
  };
}

// style="a:b;c:{{x}}" -> objek style React (hasil di-cache per string)
const cache = new Map();
export function css(s) {
  if (s == null || typeof s === 'object') return s || undefined;
  let o = cache.get(s);
  if (o) return o;
  o = {};
  for (const decl of String(s).split(';')) {
    const i = decl.indexOf(':');
    if (i < 0) continue;
    const prop = decl.slice(0, i).trim();
    if (!prop) continue;
    o[prop.startsWith('--') ? prop : prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = decl.slice(i + 1).trim();
  }
  if (cache.size > 5000) cache.clear();
  cache.set(s, o);
  return o;
}

// {{ nilai }} di dalam teks
export function txt(x) {
  if (x === undefined || x === null || typeof x === 'boolean') return null;
  if (React.isValidElement(x) || Array.isArray(x)) return x;
  return String(x);
}

export const arr = x => (Array.isArray(x) ? x : []);
