// Menu Home.
import React from 'react';
import { css, txt, arr } from '../dc/runtime.js';
import HomeAtas from '../HomeAtas.jsx';

export default function MenuBeranda({ v }) {
  return (<>
              <div style={css("padding:8px 20px 24px;display:grid;grid-template-columns:minmax(0,1fr);grid-auto-rows:max-content;gap:18px")}>
                <HomeAtas h={v.home} />
                {v.net ? (
                  <button onClick={v.openSync} style={css(`border:0;text-align:left;cursor:pointer;font:inherit;display:flex;gap:12px;align-items:flex-start;border-radius:20px;padding:12px 14px;background:${v.net.bg};color:${v.net.fg}`)}>
                    <span style={css(`width:10px;height:10px;border-radius:50%;margin-top:5px;flex:none;background:${v.net.dot}`)}></span>
                    <span style={css("display:grid;gap:2px;min-width:0")}>
                      <b style={css("font-size:calc(14px*var(--fs,1))")}>{txt(v.net.title)}</b>
                      <span style={css("font-size:calc(12.5px*var(--fs,1));line-height:1.4")}>{txt(v.net.text)}</span>
                    </span>
                  </button>
                ) : null}
                {v.canInstall ? (
                  <button onClick={v.doInstall} className="btn btn-secondary" style={css("height:46px;font-size:calc(14.5px*var(--fs,1))")}>
                    Pasang aplikasi di layar utama HP
                  </button>
                ) : null}
              </div>
              {" "}
  </>);
}
