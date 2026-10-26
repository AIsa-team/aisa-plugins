window.__ModuleLoader__.load({
	id: "@aisa-plugins/easy-search",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let react_jsx_runtime = require("react/jsx-runtime");
		let _deepseek_ai_dsh_client_runtime_client = require("@deepseek-ai/dsh-client-runtime/client");
		//#region node_modules/.pnpm/@tabler+icons-react@3.46.0_react@18.3.1/node_modules/@tabler/icons-react/dist/esm/defaultAttributes.mjs
		/**
		* @license @tabler/icons-react v3.46.0 - MIT
		*
		* This source code is licensed under the MIT license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		var defaultAttributes = {
			outline: {
				xmlns: "http://www.w3.org/2000/svg",
				width: 24,
				height: 24,
				viewBox: "0 0 24 24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: 2,
				strokeLinecap: "round",
				strokeLinejoin: "round"
			},
			filled: {
				xmlns: "http://www.w3.org/2000/svg",
				width: 24,
				height: 24,
				viewBox: "0 0 24 24",
				fill: "currentColor",
				stroke: "none"
			}
		};
		//#endregion
		//#region node_modules/.pnpm/@tabler+icons-react@3.46.0_react@18.3.1/node_modules/@tabler/icons-react/dist/esm/createReactComponent.mjs
		/**
		* @license @tabler/icons-react v3.46.0 - MIT
		*
		* This source code is licensed under the MIT license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const createReactComponent = (type, iconName, iconNamePascal, iconNode) => {
			const Component = (0, react.forwardRef)(({ color = "currentColor", size = 24, stroke = 2, title, className, children, ...rest }, ref) => (0, react.createElement)("svg", {
				ref,
				...defaultAttributes[type],
				width: size,
				height: size,
				className: [
					`tabler-icon`,
					`tabler-icon-${iconName}`,
					className
				].join(" "),
				...type === "filled" ? { fill: color } : {
					strokeWidth: stroke,
					stroke: color
				},
				...rest
			}, [
				title && (0, react.createElement)("title", { key: "svg-title" }, title),
				...iconNode.map(([tag, attrs]) => (0, react.createElement)(tag, attrs)),
				...Array.isArray(children) ? children : [children]
			]));
			Component.displayName = `${iconNamePascal}`;
			return Component;
		};
		/**
		* @license @tabler/icons-react v3.46.0 - MIT
		*
		* This source code is licensed under the MIT license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const IconAdjustmentsHorizontal = createReactComponent("outline", "adjustments-horizontal", "AdjustmentsHorizontal", [
			["path", {
				"d": "M12 6a2 2 0 1 0 4 0a2 2 0 1 0 -4 0",
				"key": "svg-0"
			}],
			["path", {
				"d": "M4 6l8 0",
				"key": "svg-1"
			}],
			["path", {
				"d": "M16 6l4 0",
				"key": "svg-2"
			}],
			["path", {
				"d": "M6 12a2 2 0 1 0 4 0a2 2 0 1 0 -4 0",
				"key": "svg-3"
			}],
			["path", {
				"d": "M4 12l2 0",
				"key": "svg-4"
			}],
			["path", {
				"d": "M10 12l10 0",
				"key": "svg-5"
			}],
			["path", {
				"d": "M15 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0",
				"key": "svg-6"
			}],
			["path", {
				"d": "M4 18l11 0",
				"key": "svg-7"
			}],
			["path", {
				"d": "M19 18l1 0",
				"key": "svg-8"
			}]
		]);
		/**
		* @license @tabler/icons-react v3.46.0 - MIT
		*
		* This source code is licensed under the MIT license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const IconArrowsShuffle = createReactComponent("outline", "arrows-shuffle", "ArrowsShuffle", [
			["path", {
				"d": "M18 4l3 3l-3 3",
				"key": "svg-0"
			}],
			["path", {
				"d": "M18 20l3 -3l-3 -3",
				"key": "svg-1"
			}],
			["path", {
				"d": "M3 7h3a5 5 0 0 1 5 5a5 5 0 0 0 5 5h5",
				"key": "svg-2"
			}],
			["path", {
				"d": "M21 7h-5a4.978 4.978 0 0 0 -3 1m-4 8a4.984 4.984 0 0 1 -3 1h-3",
				"key": "svg-3"
			}]
		]);
		/**
		* @license @tabler/icons-react v3.46.0 - MIT
		*
		* This source code is licensed under the MIT license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const IconBrandX = createReactComponent("outline", "brand-x", "BrandX", [["path", {
			"d": "M4 4l11.733 16h4.267l-11.733 -16l-4.267 0",
			"key": "svg-0"
		}], ["path", {
			"d": "M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772",
			"key": "svg-1"
		}]]);
		/**
		* @license @tabler/icons-react v3.46.0 - MIT
		*
		* This source code is licensed under the MIT license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const IconBrandYoutube = createReactComponent("outline", "brand-youtube", "BrandYoutube", [["path", {
			"d": "M2 8a4 4 0 0 1 4 -4h12a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-12a4 4 0 0 1 -4 -4v-8",
			"key": "svg-0"
		}], ["path", {
			"d": "M10 9l5 3l-5 3l0 -6",
			"key": "svg-1"
		}]]);
		/**
		* @license @tabler/icons-react v3.46.0 - MIT
		*
		* This source code is licensed under the MIT license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const IconCheck = createReactComponent("outline", "check", "Check", [["path", {
			"d": "M5 12l5 5l10 -10",
			"key": "svg-0"
		}]]);
		/**
		* @license @tabler/icons-react v3.46.0 - MIT
		*
		* This source code is licensed under the MIT license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const IconChevronDown = createReactComponent("outline", "chevron-down", "ChevronDown", [["path", {
			"d": "M6 9l6 6l6 -6",
			"key": "svg-0"
		}]]);
		/**
		* @license @tabler/icons-react v3.46.0 - MIT
		*
		* This source code is licensed under the MIT license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const IconKey = createReactComponent("outline", "key", "Key", [["path", {
			"d": "M16.555 3.843l3.602 3.602a2.877 2.877 0 0 1 0 4.069l-2.643 2.643a2.877 2.877 0 0 1 -4.069 0l-.301 -.301l-6.558 6.558a2 2 0 0 1 -1.239 .578l-.175 .008h-1.172a1 1 0 0 1 -.993 -.883l-.007 -.117v-1.172a2 2 0 0 1 .467 -1.284l.119 -.13l.414 -.414h2v-2h2v-2l2.144 -2.144l-.301 -.301a2.877 2.877 0 0 1 0 -4.069l2.643 -2.643a2.877 2.877 0 0 1 4.069 0",
			"key": "svg-0"
		}], ["path", {
			"d": "M15 9h.01",
			"key": "svg-1"
		}]]);
		/**
		* @license @tabler/icons-react v3.46.0 - MIT
		*
		* This source code is licensed under the MIT license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const IconRestore = createReactComponent("outline", "restore", "Restore", [
			["path", {
				"d": "M3.06 13a9 9 0 1 0 .49 -4.087",
				"key": "svg-0"
			}],
			["path", {
				"d": "M3 4.001v5h5",
				"key": "svg-1"
			}],
			["path", {
				"d": "M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0",
				"key": "svg-2"
			}]
		]);
		/**
		* @license @tabler/icons-react v3.46.0 - MIT
		*
		* This source code is licensed under the MIT license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const IconRoute = createReactComponent("outline", "route", "Route", [
			["path", {
				"d": "M3 19a2 2 0 1 0 4 0a2 2 0 0 0 -4 0",
				"key": "svg-0"
			}],
			["path", {
				"d": "M19 7a2 2 0 1 0 0 -4a2 2 0 0 0 0 4",
				"key": "svg-1"
			}],
			["path", {
				"d": "M11 19h5.5a3.5 3.5 0 0 0 0 -7h-8a3.5 3.5 0 0 1 0 -7h4.5",
				"key": "svg-2"
			}]
		]);
		/**
		* @license @tabler/icons-react v3.46.0 - MIT
		*
		* This source code is licensed under the MIT license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const IconSchool = createReactComponent("outline", "school", "School", [["path", {
			"d": "M22 9l-10 -4l-10 4l10 4l10 -4v6",
			"key": "svg-0"
		}], ["path", {
			"d": "M6 10.6v5.4a6 3 0 0 0 12 0v-5.4",
			"key": "svg-1"
		}]]);
		/**
		* @license @tabler/icons-react v3.46.0 - MIT
		*
		* This source code is licensed under the MIT license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const IconTrash = createReactComponent("outline", "trash", "Trash", [
			["path", {
				"d": "M4 7l16 0",
				"key": "svg-0"
			}],
			["path", {
				"d": "M10 11l0 6",
				"key": "svg-1"
			}],
			["path", {
				"d": "M14 11l0 6",
				"key": "svg-2"
			}],
			["path", {
				"d": "M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12",
				"key": "svg-3"
			}],
			["path", {
				"d": "M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3",
				"key": "svg-4"
			}]
		]);
		/**
		* @license @tabler/icons-react v3.46.0 - MIT
		*
		* This source code is licensed under the MIT license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const IconWorldSearch = createReactComponent("outline", "world-search", "WorldSearch", [
			["path", {
				"d": "M21 12a9 9 0 1 0 -9 9",
				"key": "svg-0"
			}],
			["path", {
				"d": "M3.6 9h16.8",
				"key": "svg-1"
			}],
			["path", {
				"d": "M3.6 15h7.9",
				"key": "svg-2"
			}],
			["path", {
				"d": "M11.5 3a17 17 0 0 0 0 18",
				"key": "svg-3"
			}],
			["path", {
				"d": "M12.5 3a16.984 16.984 0 0 1 2.574 8.62",
				"key": "svg-4"
			}],
			["path", {
				"d": "M15 18a3 3 0 1 0 6 0a3 3 0 1 0 -6 0",
				"key": "svg-5"
			}],
			["path", {
				"d": "M20.2 20.2l1.8 1.8",
				"key": "svg-6"
			}]
		]);
		//#endregion
		//#region src/settings.ts
		const ROUTING_MODES = [
			"aisa",
			"byok",
			"hybrid"
		];
		const CREDENTIAL_PROVIDERS = [
			"aisa",
			"tavily",
			"x",
			"youtube",
			"serpapi"
		];
		const DEFAULT_AISA_API_KEY_ENV = "AISA_API_KEY";
		const DEFAULT_TAVILY_API_KEY_ENV = "TAVILY_API_KEY";
		const DEFAULT_X_BEARER_TOKEN_ENV = "X_BEARER_TOKEN";
		const DEFAULT_YOUTUBE_API_KEY_ENV = "YOUTUBE_API_KEY";
		const DEFAULT_SERPAPI_API_KEY_ENV = "SERPAPI_API_KEY";
		const CREDENTIAL_REF_FIELDS = {
			aisa: "aisaApiKeyEnv",
			tavily: "tavilyApiKeyEnv",
			x: "xBearerTokenEnv",
			youtube: "youtubeApiKeyEnv",
			serpapi: "serpApiKeyEnv"
		};
		const DEFAULT_CREDENTIAL_REFS = {
			aisa: DEFAULT_AISA_API_KEY_ENV,
			tavily: DEFAULT_TAVILY_API_KEY_ENV,
			x: DEFAULT_X_BEARER_TOKEN_ENV,
			youtube: DEFAULT_YOUTUBE_API_KEY_ENV,
			serpapi: DEFAULT_SERPAPI_API_KEY_ENV
		};
		//#endregion
		//#region src/client/model.ts
		const PROVIDERS_BY_MODE = {
			aisa: ["aisa"],
			hybrid: CREDENTIAL_PROVIDERS,
			byok: [
				"tavily",
				"x",
				"youtube",
				"serpapi"
			]
		};
		function providersForMode(mode) {
			return PROVIDERS_BY_MODE[mode];
		}
		function credentialRefs(settings) {
			return Object.fromEntries(CREDENTIAL_PROVIDERS.map((provider) => {
				const value = settings?.[CREDENTIAL_REF_FIELDS[provider]];
				return [provider, typeof value === "string" && value.length > 0 ? value : DEFAULT_CREDENTIAL_REFS[provider]];
			}));
		}
		function isRoutingMode(value) {
			return typeof value === "string" && ROUTING_MODES.includes(value);
		}
		function validOrigin(value) {
			if (!URL.canParse(value)) return false;
			const url = new URL(value);
			return ["http:", "https:"].includes(url.protocol) && url.username === "" && url.password === "" && url.pathname === "/" && url.search === "" && url.hash === "";
		}
		function validApiKey(value) {
			if (value.length === 0) return true;
			const trimmed = value.trim();
			if (trimmed.length === 0 || !/^[\x21-\x7e]+$/.test(trimmed)) return false;
			const first = trimmed[0];
			if ((first === "\"" || first === "'" || first === "`") && trimmed.endsWith(first)) return false;
			return !/^[A-Z][A-Z0-9_]*=[^=]/.test(trimmed);
		}
		//#endregion
		//#region src/client/card.tsx
		const EASY_SEARCH_LOCALE_NAMESPACE = "easy-search.settings";
		const MODE_BY_ID = {
			aisa: {
				mode: "aisa",
				label: "modeAisa",
				meta: "modeAisaMeta",
				icon: IconRoute
			},
			hybrid: {
				mode: "hybrid",
				label: "modeHybrid",
				meta: "modeHybridMeta",
				icon: IconArrowsShuffle
			},
			byok: {
				mode: "byok",
				label: "modeByok",
				meta: "modeByokMeta",
				icon: IconKey
			}
		};
		const MODES = Object.values(MODE_BY_ID);
		const PROVIDERS = {
			aisa: {
				name: "providerAisa",
				role: "providerAisaRole",
				icon: IconRoute
			},
			tavily: {
				name: "providerTavily",
				role: "providerTavilyRole",
				icon: IconWorldSearch
			},
			x: {
				name: "providerX",
				role: "providerXRole",
				icon: IconBrandX
			},
			youtube: {
				name: "providerYoutube",
				role: "providerYoutubeRole",
				icon: IconBrandYoutube
			},
			serpapi: {
				name: "providerSerpapi",
				role: "providerSerpapiRole",
				icon: IconSchool
			}
		};
		function translated(t, key, value) {
			return t(key).replace("{value}", value);
		}
		function statusLabel(t, credential) {
			if (credential.removing) return "willRemove";
			if (credential.draft.length > 0) return "pending";
			return credential.configured ? "configured" : "missing";
		}
		function CredentialRow(props) {
			const meta = PROVIDERS[props.provider];
			const credential = props.state.credentials[props.provider];
			const ProviderIcon = meta.icon;
			const disabled = props.state.saving || !credential.writable || credential.removing;
			const status = statusLabel(props.t, credential);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "easy-search-credential",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "easy-search-provider-mark",
						"aria-hidden": true,
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ProviderIcon, {
							size: 18,
							stroke: 1.8
						})
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "easy-search-provider-copy",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "easy-search-provider-name",
							children: props.t(meta.name)
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "easy-search-provider-role",
							children: props.t(meta.role)
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
						className: "easy-search-key-field",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "easy-search-sr-only",
							children: props.t(meta.name)
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
							type: "password",
							autoComplete: "off",
							value: credential.draft,
							placeholder: credential.removing ? props.t("willRemove") : props.t("keyPlaceholder"),
							"aria-invalid": credential.invalid || void 0,
							disabled,
							onChange: (event) => {
								props.editKey(props.provider, event.target.value);
							}
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
						className: `easy-search-key-status easy-search-key-status--${status}`,
						title: !credential.writable && credential.configured ? props.t("sourceEnvironment") : void 0,
						children: [status === "configured" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(IconCheck, {
							size: 13,
							stroke: 2.2,
							"aria-hidden": true
						}) : null, props.t(status)]
					}),
					credential.removing ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: "easy-search-key-action",
						title: props.t("undoRemove"),
						"aria-label": `${props.t("undoRemove")}: ${props.t(meta.name)}`,
						onClick: () => {
							props.keepKey(props.provider);
						},
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(IconRestore, {
							size: 16,
							stroke: 1.8
						})
					}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: "easy-search-key-action easy-search-key-action--danger",
						title: props.t("removeKey"),
						"aria-label": `${props.t("removeKey")}: ${props.t(meta.name)}`,
						disabled: !credential.configured || !credential.writable || props.state.saving,
						onClick: () => {
							props.removeKey(props.provider);
						},
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(IconTrash, {
							size: 16,
							stroke: 1.8
						})
					}),
					credential.invalid ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: "easy-search-field-error",
						children: props.t("invalidKey")
					}) : null
				]
			});
		}
		function EasySearchCard(props) {
			const [open, setOpen] = (0, react.useState)(false);
			const state = props.useEasySearchCard((snapshot) => snapshot);
			if (!state.available) return null;
			const routeProviders = providersForMode(state.mode);
			const visibleProviders = CREDENTIAL_PROVIDERS.filter((provider) => routeProviders.includes(provider) || state.credentials[provider].draft.length > 0 || state.credentials[provider].removing);
			const mode = MODE_BY_ID[state.mode];
			const resultOptions = [.../* @__PURE__ */ new Set([
				3,
				5,
				8,
				10,
				state.defaultMaxResults
			])].sort((a, b) => a - b);
			const timeoutOptions = [.../* @__PURE__ */ new Set([
				15,
				30,
				60,
				120,
				state.requestTimeoutSeconds
			])].sort((a, b) => a - b);
			const saveDisabled = !state.dirty || state.invalid || state.saving;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", {
				className: `easy-search-card${open ? " easy-search-card--open" : ""}`,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "easy-search-header",
					"aria-expanded": open,
					"aria-label": props.t(open ? "collapse" : "expand"),
					onClick: () => {
						setOpen((current) => !current);
					},
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "easy-search-logo",
							"aria-hidden": true,
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(IconWorldSearch, {
								size: 19,
								stroke: 1.8
							})
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: "easy-search-head-copy",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "easy-search-title",
								children: props.t("title")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "easy-search-description",
								children: props.t("description")
							})]
						}),
						state.dirty ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "easy-search-unsaved",
							children: props.t("unsaved")
						}) : null,
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: `easy-search-mode-badge easy-search-mode-badge--${state.mode}`,
							children: props.t(mode.label)
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(IconChevronDown, {
							size: 17,
							stroke: 1.8,
							className: `easy-search-chevron${open ? " easy-search-chevron--open" : ""}`,
							"aria-hidden": true
						})
					]
				}), open ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "easy-search-body",
					children: [
						!state.writable ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: "easy-search-notice",
							children: props.t("readOnly")
						}) : null,
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
							className: "easy-search-section",
							"aria-labelledby": "easy-search-route-label",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "easy-search-section-head",
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", {
									id: "easy-search-route-label",
									children: props.t("modeLabel")
								})
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "easy-search-modes",
								role: "radiogroup",
								"aria-label": props.t("modeLabel"),
								children: MODES.map((option) => {
									const ModeIcon = option.icon;
									const selected = option.mode === state.mode;
									return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
										type: "button",
										role: "radio",
										"aria-checked": selected,
										className: `easy-search-mode easy-search-mode--${option.mode}${selected ? " is-selected" : ""}`,
										disabled: !state.writable || state.saving,
										onClick: () => {
											props.setMode(option.mode);
										},
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ModeIcon, {
											size: 18,
											stroke: 1.8,
											"aria-hidden": true
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: props.t(option.label) }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", { children: props.t(option.meta) })] })]
									}, option.mode);
								})
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
							className: "easy-search-section",
							"aria-labelledby": "easy-search-credentials-label",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "easy-search-section-head",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", {
									id: "easy-search-credentials-label",
									children: props.t("credentials")
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "easy-search-count",
									children: String(visibleProviders.length)
								})]
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: "easy-search-credentials",
								children: visibleProviders.map((provider) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(CredentialRow, {
									provider,
									state,
									t: props.t,
									editKey: props.editKey,
									removeKey: props.removeKey,
									keepKey: props.keepKey
								}, provider))
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("details", {
							className: "easy-search-advanced",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("summary", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(IconAdjustmentsHorizontal, {
									size: 16,
									stroke: 1.8,
									"aria-hidden": true
								}), props.t("advanced")] }), state.advancedOverridden ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "easy-search-dot",
									"aria-hidden": true
								}) : null] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "easy-search-advanced-grid",
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: props.t("resultCount") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("select", {
											value: state.defaultMaxResults,
											disabled: !state.writable || state.saving,
											onChange: (event) => {
												props.setDefaultMaxResults(Number(event.target.value));
											},
											children: resultOptions.map((value) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
												value,
												children: String(value)
											}, value))
										})] }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: props.t("timeout") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("select", {
											value: state.requestTimeoutSeconds,
											disabled: !state.writable || state.saving,
											onChange: (event) => {
												props.setRequestTimeoutSeconds(Number(event.target.value));
											},
											children: timeoutOptions.map((value) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
												value,
												children: translated(props.t, "seconds", String(value))
											}, value))
										})] }),
										state.mode === "byok" ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
											className: "easy-search-endpoint",
											children: [
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: props.t("aisaEndpoint") }),
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
													type: "url",
													value: state.aisaBaseUrl,
													"aria-invalid": state.aisaBaseUrlInvalid || void 0,
													disabled: !state.writable || state.saving,
													onChange: (event) => {
														props.setAisaBaseUrl(event.target.value);
													}
												}),
												state.aisaBaseUrlInvalid ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
													className: "easy-search-field-error",
													children: props.t("invalidEndpoint")
												}) : null
											]
										})
									]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: "easy-search-reset",
									disabled: !state.writable || state.saving,
									onClick: props.resetAdvanced,
									children: props.t("resetAdvanced")
								})
							]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("footer", {
							className: "easy-search-footer",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "easy-search-footer-message",
									role: "status",
									children: state.failure === "save" ? props.t("saveFailed") : state.failure === "credentials" ? props.t("credentialLoadFailed") : ""
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: "easy-search-button easy-search-button--ghost",
									disabled: !state.dirty || state.saving,
									onClick: props.discard,
									children: props.t("discard")
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: "easy-search-button easy-search-button--primary",
									disabled: saveDisabled,
									onClick: props.save,
									children: props.t(state.saving ? "saving" : "save")
								})
							]
						})
					]
				}) : null]
			});
		}
		//#endregion
		//#region src/client/controller.ts
		function record(value) {
			return typeof value === "object" && value !== null && !Array.isArray(value) ? value : void 0;
		}
		function sameValue(left, right) {
			return Object.is(left, right);
		}
		var EasySearchCardController = class {
			scope;
			api;
			store;
			settingDrafts = /* @__PURE__ */ new Map();
			keyDrafts = /* @__PURE__ */ new Map();
			keyRemovals = /* @__PURE__ */ new Set();
			credentialViews = /* @__PURE__ */ new Map();
			stopScope;
			credentialGeneration = 0;
			refSignature = "";
			saving = false;
			failure = null;
			constructor(scope, api) {
				this.scope = scope;
				this.api = api;
				this.store = (0, _deepseek_ai_dsh_client_runtime_client.createSnapshotStore)(this.project());
				this.refSignature = this.currentRefSignature();
				this.stopScope = scope.subscribe(() => {
					const signature = this.currentRefSignature();
					if (signature !== this.refSignature) {
						this.refSignature = signature;
						this.readCredentials();
					}
					this.publish();
				});
				this.readCredentials();
			}
			dispose() {
				this.credentialGeneration += 1;
				this.stopScope();
			}
			inject() {
				return {
					hooks: { easySearchCard: this.store },
					setMode: (mode) => {
						this.stage("routingMode", mode);
					},
					setDefaultMaxResults: (value) => {
						this.stage("defaultMaxResults", value);
					},
					setRequestTimeoutSeconds: (value) => {
						this.stage("requestTimeoutMs", value * 1e3);
					},
					setAisaBaseUrl: (value) => {
						this.stage("aisaBaseUrl", value);
					},
					editKey: (provider, value) => {
						if (value.length === 0) this.keyDrafts.delete(provider);
						else this.keyDrafts.set(provider, value);
						this.keyRemovals.delete(provider);
						this.failure = null;
						this.publish();
					},
					removeKey: (provider) => {
						this.keyDrafts.delete(provider);
						this.keyRemovals.add(provider);
						this.failure = null;
						this.publish();
					},
					keepKey: (provider) => {
						this.keyRemovals.delete(provider);
						this.failure = null;
						this.publish();
					},
					resetAdvanced: () => {
						this.reset("aisaBaseUrl");
						this.reset("defaultMaxResults");
						this.reset("requestTimeoutMs");
					},
					discard: () => {
						this.settingDrafts.clear();
						this.keyDrafts.clear();
						this.keyRemovals.clear();
						this.failure = null;
						this.publish();
					},
					save: () => {
						this.save();
					}
				};
			}
			refreshCredential(ref) {
				if (!Object.values(credentialRefs(this.snapshot().value)).includes(ref)) return;
				this.readCredentials();
			}
			snapshot() {
				return this.scope.getSnapshot();
			}
			effective(field) {
				const draft = this.settingDrafts.get(field);
				if (draft?.kind === "set") return draft.value;
				if (draft?.kind === "clear") return record(this.snapshot().base)?.[field];
				return this.snapshot().value?.[field];
			}
			stage(field, value) {
				const current = this.snapshot().value?.[field];
				if (sameValue(value, current)) this.settingDrafts.delete(field);
				else this.settingDrafts.set(field, {
					kind: "set",
					value
				});
				this.failure = null;
				this.publish();
			}
			reset(field) {
				if (Object.hasOwn(record(this.snapshot().user) ?? {}, field)) this.settingDrafts.set(field, { kind: "clear" });
				else this.settingDrafts.delete(field);
				this.failure = null;
				this.publish();
			}
			settingsPlan() {
				const user = record(this.snapshot().user) ?? {};
				return [...this.settingDrafts].filter(([field, draft]) => draft.kind === "clear" ? Object.hasOwn(user, field) : !sameValue(draft.value, this.snapshot().value?.[field]));
			}
			projectCredential(provider) {
				const ref = credentialRefs(this.snapshot().value)[provider];
				const current = this.credentialViews.get(provider);
				const draft = this.keyDrafts.get(provider) ?? "";
				return {
					ref,
					configured: current?.ref === ref ? current.configured : false,
					writable: current?.ref === ref ? current.writable : true,
					...current?.ref === ref && current.source !== void 0 ? { source: current.source } : {},
					draft,
					removing: this.keyRemovals.has(provider),
					invalid: !validApiKey(draft)
				};
			}
			project() {
				const modeValue = this.effective("routingMode");
				const mode = isRoutingMode(modeValue) ? modeValue : "aisa";
				const defaultMaxResults = this.effective("defaultMaxResults");
				const timeout = this.effective("requestTimeoutMs");
				const endpoint = this.effective("aisaBaseUrl");
				const credentials = Object.fromEntries(CREDENTIAL_PROVIDERS.map((provider) => [provider, this.projectCredential(provider)]));
				const aisaBaseUrl = typeof endpoint === "string" ? endpoint : "https://api.aisa.one";
				const invalidCredentials = CREDENTIAL_PROVIDERS.some((provider) => credentials[provider].invalid);
				const user = record(this.snapshot().user) ?? {};
				return {
					available: this.snapshot().status === "ready",
					writable: this.snapshot().writable,
					dirty: this.settingsPlan().length > 0 || this.keyDrafts.size > 0 || this.keyRemovals.size > 0,
					invalid: !validOrigin(aisaBaseUrl) || invalidCredentials,
					saving: this.saving,
					failure: this.failure,
					mode,
					defaultMaxResults: typeof defaultMaxResults === "number" ? defaultMaxResults : 5,
					requestTimeoutSeconds: typeof timeout === "number" ? timeout / 1e3 : 30,
					aisaBaseUrl,
					aisaBaseUrlInvalid: !validOrigin(aisaBaseUrl),
					advancedOverridden: [
						"aisaBaseUrl",
						"defaultMaxResults",
						"requestTimeoutMs"
					].some((field) => Object.hasOwn(user, field)),
					credentials
				};
			}
			publish() {
				this.store.set(this.project());
			}
			currentRefSignature() {
				return CREDENTIAL_PROVIDERS.map((provider) => credentialRefs(this.snapshot().value)[provider]).join("\0");
			}
			async readCredentials() {
				const generation = ++this.credentialGeneration;
				const refs = credentialRefs(this.snapshot().value);
				try {
					const response = await this.api.credentials.describe({ refs: [...new Set(Object.values(refs))] });
					if (generation !== this.credentialGeneration) return;
					if (!response.result.ok) {
						this.failure = "credentials";
						this.publish();
						return;
					}
					for (const provider of CREDENTIAL_PROVIDERS) {
						const ref = refs[provider];
						const view = response.result.value.credentials[ref];
						this.credentialViews.set(provider, {
							ref,
							configured: view?.configured ?? false,
							writable: view?.writable ?? true,
							...view?.source === void 0 ? {} : { source: view.source }
						});
					}
					if (this.failure === "credentials") this.failure = null;
					this.publish();
				} catch (_transportFailure) {
					if (generation !== this.credentialGeneration) return;
					this.failure = "credentials";
					this.publish();
				}
			}
			async save() {
				const projected = this.project();
				if (!projected.dirty || projected.invalid || this.saving) return;
				this.saving = true;
				this.failure = null;
				this.publish();
				try {
					for (const [field, draft] of this.settingsPlan()) {
						if (draft.kind === "clear") await this.scope.unset(field);
						else await this.scope.set(field, draft.value);
						this.settingDrafts.delete(field);
					}
					const refs = credentialRefs(this.snapshot().value);
					for (const provider of CREDENTIAL_PROVIDERS) {
						if (this.keyRemovals.has(provider)) {
							const response = await this.api.credentials.unset({ ref: refs[provider] });
							if (!response.result.ok) throw new Error(response.result.error.message);
							this.keyRemovals.delete(provider);
						}
						const value = this.keyDrafts.get(provider)?.trim();
						if (value === void 0 || value.length === 0) continue;
						const response = await this.api.credentials.set({
							ref: refs[provider],
							value
						});
						if (!response.result.ok) throw new Error(response.result.error.message);
						this.keyDrafts.delete(provider);
					}
					await this.readCredentials();
				} catch (_writeFailure) {
					this.failure = "save";
				} finally {
					this.saving = false;
					this.publish();
				}
			}
		};
		//#endregion
		//#region src/client/locales.ts
		const en = {
			title: "Easy Search",
			description: "Search routing and provider credentials.",
			expand: "Show Easy Search settings",
			collapse: "Hide Easy Search settings",
			unsaved: "Unsaved",
			readOnly: "Routing settings are read-only in this deployment.",
			modeLabel: "Route",
			modeAisa: "One Key",
			modeAisaMeta: "AIsa → every source",
			modeHybrid: "Smart mix",
			modeHybridMeta: "Direct first · AIsa fallback",
			modeByok: "BYOK",
			modeByokMeta: "Direct provider APIs",
			credentials: "Credentials",
			configured: "Ready",
			missing: "Not set",
			pending: "Pending",
			willRemove: "Will remove",
			sourceEnvironment: "From environment",
			keyPlaceholder: "Paste a new key",
			removeKey: "Remove key",
			undoRemove: "Keep key",
			providerAisa: "AIsa One Key",
			providerAisaRole: "All sources",
			providerTavily: "Tavily",
			providerTavilyRole: "Web + extract",
			providerX: "X API",
			providerXRole: "Posts",
			providerYoutube: "YouTube",
			providerYoutubeRole: "Video",
			providerSerpapi: "SerpApi",
			providerSerpapiRole: "Scholar",
			advanced: "Advanced",
			resultCount: "Default results",
			timeout: "Request timeout",
			seconds: "{value}s",
			aisaEndpoint: "AIsa endpoint",
			invalidEndpoint: "Enter an HTTP(S) origin without a path.",
			invalidKey: "Paste the raw key without spaces or quotes.",
			resetAdvanced: "Reset advanced settings",
			discard: "Discard",
			save: "Save changes",
			saving: "Saving…",
			saveFailed: "Changes were not fully saved. Check the fields and try again.",
			credentialLoadFailed: "Credential status is temporarily unavailable."
		};
		const zh = {
			title: "Easy Search",
			description: "搜索路由与提供商密钥。",
			expand: "展开 Easy Search 设置",
			collapse: "收起 Easy Search 设置",
			unsaved: "未保存",
			readOnly: "本部署的路由设置为只读。",
			modeLabel: "路由方式",
			modeAisa: "One Key",
			modeAisaMeta: "AIsa → 全部来源",
			modeHybrid: "智能组合",
			modeHybridMeta: "直连优先 · AIsa 补位",
			modeByok: "BYOK",
			modeByokMeta: "直连各家官方接口",
			credentials: "密钥",
			configured: "已就绪",
			missing: "未配置",
			pending: "待保存",
			willRemove: "将移除",
			sourceEnvironment: "来自环境变量",
			keyPlaceholder: "粘贴新密钥",
			removeKey: "移除密钥",
			undoRemove: "保留密钥",
			providerAisa: "AIsa One Key",
			providerAisaRole: "全部来源",
			providerTavily: "Tavily",
			providerTavilyRole: "网页 + 抽取",
			providerX: "X API",
			providerXRole: "帖子",
			providerYoutube: "YouTube",
			providerYoutubeRole: "视频",
			providerSerpapi: "SerpApi",
			providerSerpapiRole: "学术",
			advanced: "高级设置",
			resultCount: "默认结果数",
			timeout: "请求超时",
			seconds: "{value} 秒",
			aisaEndpoint: "AIsa 接口地址",
			invalidEndpoint: "请输入不带路径的 HTTP(S) 地址。",
			invalidKey: "请只粘贴原始密钥，不要包含空格或引号。",
			resetAdvanced: "恢复高级设置默认值",
			discard: "放弃修改",
			save: "保存更改",
			saving: "保存中…",
			saveFailed: "部分更改未能保存，请检查后重试。",
			credentialLoadFailed: "暂时无法读取密钥状态。"
		};
		//#endregion
		//#region src/client/styles.ts
		const STYLE_ID = "easy-search-settings-styles";
		const CSS = `
.easy-search-card {
  --easy-blue: #4f8cff;
  --easy-violet: #8b7cf6;
  --easy-mint: #37c995;
  list-style: none;
  overflow: hidden;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 14px;
  color: var(--dsw-alias-label-primary);
  background: var(--dsw-alias-bg-layer-3);
  transition: border-color .16s ease, background .16s ease;
}
.easy-search-card:hover { border-color: var(--dsw-alias-label-dimmed); }
.easy-search-card--open {
  border-color: color-mix(in srgb, var(--easy-blue) 28%, var(--dsw-alias-border-l2));
  background: var(--dsw-alias-bg-layer-2);
}
.easy-search-card * { box-sizing: border-box; }
.easy-search-card button,
.easy-search-card input,
.easy-search-card select { font: inherit; }
.easy-search-card :is(button, input, select):focus-visible {
  outline: 2px solid var(--dsw-alias-brand-primary);
  outline-offset: 2px;
}
.easy-search-header {
  width: 100%;
  min-height: 68px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 0;
  border-radius: 14px;
  padding: 13px 16px;
  color: inherit;
  background: transparent;
  text-align: left;
  cursor: pointer;
}
.easy-search-logo {
  width: 34px;
  height: 34px;
  flex: none;
  display: grid;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--easy-blue) 28%, var(--dsw-alias-border-l2));
  border-radius: 10px;
  color: color-mix(in srgb, var(--easy-blue) 82%, var(--dsw-alias-label-primary));
  background: color-mix(in srgb, var(--easy-blue) 9%, transparent);
}
.easy-search-head-copy {
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.easy-search-title { font-size: 15px; font-weight: 650; line-height: 1.35; }
.easy-search-description {
  overflow: hidden;
  color: var(--dsw-alias-label-tertiary);
  font-size: 13px;
  line-height: 1.4;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.easy-search-unsaved,
.easy-search-mode-badge,
.easy-search-key-status,
.easy-search-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  white-space: nowrap;
  font-size: 11px;
  font-weight: 600;
  line-height: 19px;
}
.easy-search-unsaved {
  padding: 0 8px;
  color: var(--dsw-alias-label-secondary);
  background: var(--dsw-alias-bg-module-platform);
}
.easy-search-mode-badge { padding: 0 9px; }
.easy-search-mode-badge--aisa {
  color: color-mix(in srgb, var(--easy-blue) 82%, var(--dsw-alias-label-primary));
  background: color-mix(in srgb, var(--easy-blue) 11%, transparent);
}
.easy-search-mode-badge--hybrid {
  color: color-mix(in srgb, var(--easy-violet) 82%, var(--dsw-alias-label-primary));
  background: color-mix(in srgb, var(--easy-violet) 11%, transparent);
}
.easy-search-mode-badge--byok {
  color: color-mix(in srgb, var(--easy-mint) 80%, var(--dsw-alias-label-primary));
  background: color-mix(in srgb, var(--easy-mint) 11%, transparent);
}
.easy-search-chevron {
  flex: none;
  color: var(--dsw-alias-label-tertiary);
  transition: transform .16s ease;
}
.easy-search-chevron--open { transform: rotate(180deg); }
.easy-search-body {
  margin: 0 16px;
  border-top: 1px solid var(--dsw-alias-border-l2);
  padding: 14px 0 8px;
}
.easy-search-notice {
  margin: 0 0 12px;
  border-radius: 8px;
  padding: 8px 10px;
  color: var(--dsw-alias-label-secondary);
  background: var(--dsw-alias-bg-module-platform);
  font-size: 12px;
}
.easy-search-section { padding: 2px 0 16px; }
.easy-search-section + .easy-search-section {
  border-top: 1px solid var(--dsw-alias-border-l2);
  padding-top: 14px;
}
.easy-search-section-head {
  min-height: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 9px;
}
.easy-search-section-head h3 {
  flex: 1;
  margin: 0;
  font-size: 13px;
  font-weight: 650;
  line-height: 1.4;
}
.easy-search-count {
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  color: var(--dsw-alias-label-tertiary);
  background: var(--dsw-alias-bg-layer-3);
}
.easy-search-modes {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}
.easy-search-mode {
  min-width: 0;
  min-height: 58px;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 10px;
  padding: 9px 11px;
  color: var(--dsw-alias-label-secondary);
  background: var(--dsw-alias-bg-layer-3);
  text-align: left;
  cursor: pointer;
  transition: border-color .14s ease, background .14s ease, color .14s ease;
}
.easy-search-mode > svg { flex: none; }
.easy-search-mode > span { min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.easy-search-mode strong { color: var(--dsw-alias-label-primary); font-size: 13px; line-height: 1.35; }
.easy-search-mode small {
  overflow: hidden;
  color: var(--dsw-alias-label-tertiary);
  font-size: 11px;
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.easy-search-mode:hover:not(:disabled) { border-color: var(--dsw-alias-label-dimmed); }
.easy-search-mode--aisa.is-selected {
  border-color: color-mix(in srgb, var(--easy-blue) 55%, var(--dsw-alias-border-l2));
  color: var(--easy-blue);
  background: color-mix(in srgb, var(--easy-blue) 8%, var(--dsw-alias-bg-layer-3));
}
.easy-search-mode--hybrid.is-selected {
  border-color: color-mix(in srgb, var(--easy-violet) 55%, var(--dsw-alias-border-l2));
  color: var(--easy-violet);
  background: color-mix(in srgb, var(--easy-violet) 8%, var(--dsw-alias-bg-layer-3));
}
.easy-search-mode--byok.is-selected {
  border-color: color-mix(in srgb, var(--easy-mint) 55%, var(--dsw-alias-border-l2));
  color: var(--easy-mint);
  background: color-mix(in srgb, var(--easy-mint) 8%, var(--dsw-alias-bg-layer-3));
}
.easy-search-mode:disabled { cursor: default; opacity: .55; }
.easy-search-credentials {
  overflow: hidden;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 10px;
  background: var(--dsw-alias-bg-layer-3);
}
.easy-search-credential {
  min-height: 54px;
  display: grid;
  grid-template-columns: 32px minmax(104px, 148px) minmax(150px, 1fr) auto 30px;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
}
.easy-search-credential + .easy-search-credential { border-top: 1px solid var(--dsw-alias-border-l2); }
.easy-search-provider-mark {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  color: var(--dsw-alias-label-secondary);
  background: var(--dsw-alias-bg-layer-2);
}
.easy-search-provider-copy { min-width: 0; display: flex; flex-direction: column; gap: 1px; }
.easy-search-provider-name {
  overflow: hidden;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.4;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.easy-search-provider-role { color: var(--dsw-alias-label-tertiary); font-size: 11px; line-height: 1.35; }
.easy-search-key-field { min-width: 0; }
.easy-search-key-field input,
.easy-search-advanced-grid input,
.easy-search-advanced-grid select {
  width: 100%;
  height: 34px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 8px;
  padding: 0 10px;
  color: var(--dsw-alias-label-primary);
  background: var(--dsw-alias-bg-layer-2);
}
.easy-search-key-field input::placeholder { color: var(--dsw-alias-label-tertiary); }
.easy-search-key-field input[aria-invalid="true"],
.easy-search-advanced-grid input[aria-invalid="true"] { border-color: var(--dsw-alias-label-error); }
.easy-search-key-field input:disabled,
.easy-search-advanced-grid :is(input, select):disabled { cursor: default; opacity: .55; }
.easy-search-key-status {
  gap: 4px;
  padding: 0 7px;
  color: var(--dsw-alias-label-tertiary);
  background: var(--dsw-alias-bg-layer-2);
}
.easy-search-key-status--configured {
  color: color-mix(in srgb, var(--easy-mint) 80%, var(--dsw-alias-label-primary));
  background: color-mix(in srgb, var(--easy-mint) 9%, transparent);
}
.easy-search-key-status--pending {
  color: color-mix(in srgb, var(--easy-blue) 82%, var(--dsw-alias-label-primary));
  background: color-mix(in srgb, var(--easy-blue) 9%, transparent);
}
.easy-search-key-status--willRemove { color: var(--dsw-alias-label-error); }
.easy-search-key-action {
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 7px;
  padding: 0;
  color: var(--dsw-alias-label-tertiary);
  background: transparent;
  cursor: pointer;
}
.easy-search-key-action:hover:not(:disabled) { color: var(--dsw-alias-label-primary); background: var(--dsw-alias-bg-layer-2); }
.easy-search-key-action--danger:hover:not(:disabled) { color: var(--dsw-alias-label-error); }
.easy-search-key-action:disabled { opacity: .28; cursor: default; }
.easy-search-field-error {
  grid-column: 3 / -1;
  color: var(--dsw-alias-label-error);
  font-size: 11px;
  line-height: 1.35;
}
.easy-search-advanced {
  border-top: 1px solid var(--dsw-alias-border-l2);
  padding: 12px 0 14px;
}
.easy-search-advanced summary {
  min-height: 28px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--dsw-alias-label-secondary);
  cursor: pointer;
  list-style: none;
  font-size: 12px;
  font-weight: 600;
}
.easy-search-advanced summary::-webkit-details-marker { display: none; }
.easy-search-advanced summary > span:first-child { display: inline-flex; align-items: center; gap: 7px; }
.easy-search-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--easy-blue); }
.easy-search-advanced-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  padding-top: 11px;
}
.easy-search-advanced-grid label { min-width: 0; display: flex; flex-direction: column; gap: 6px; }
.easy-search-advanced-grid label > span:first-child {
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  font-weight: 500;
}
.easy-search-endpoint { grid-column: 1 / -1; }
.easy-search-reset {
  border: 0;
  padding: 10px 0 0;
  color: var(--dsw-alias-label-tertiary);
  background: transparent;
  cursor: pointer;
  font-size: 11px;
}
.easy-search-reset:hover:not(:disabled) { color: var(--dsw-alias-label-primary); }
.easy-search-reset:disabled { cursor: default; opacity: .5; }
.easy-search-footer {
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  border-top: 1px solid var(--dsw-alias-border-l2);
  padding-top: 10px;
}
.easy-search-footer-message {
  min-width: 0;
  flex: 1;
  color: var(--dsw-alias-label-error);
  font-size: 11px;
  line-height: 1.4;
}
.easy-search-button {
  min-height: 32px;
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 0 13px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 550;
}
.easy-search-button--ghost {
  border-color: var(--dsw-alias-border-l2);
  color: var(--dsw-alias-label-secondary);
  background: transparent;
}
.easy-search-button--primary {
  color: var(--dsw-alias-bg-layer-3);
  background: var(--dsw-alias-label-primary);
}
.easy-search-button:hover:not(:disabled) { filter: brightness(1.05); }
.easy-search-button:disabled { opacity: .4; cursor: default; }
.easy-search-sr-only {
  width: 1px;
  height: 1px;
  position: absolute;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}
@media (max-width: 720px) {
  .easy-search-mode-badge { display: none; }
  .easy-search-modes { grid-template-columns: 1fr; }
  .easy-search-mode { min-height: 52px; }
  .easy-search-credential {
    grid-template-columns: 32px minmax(0, 1fr) auto 30px;
  }
  .easy-search-key-field { grid-column: 1 / -1; grid-row: 2; }
  .easy-search-key-status { grid-column: 3; grid-row: 1; }
  .easy-search-key-action { grid-column: 4; grid-row: 1; }
  .easy-search-field-error { grid-column: 1 / -1; }
}
@media (max-width: 480px) {
  .easy-search-header { padding-inline: 12px; }
  .easy-search-description, .easy-search-unsaved { display: none; }
  .easy-search-body { margin-inline: 12px; }
  .easy-search-advanced-grid { grid-template-columns: 1fr; }
  .easy-search-endpoint { grid-column: auto; }
  .easy-search-footer { flex-wrap: wrap; }
  .easy-search-footer-message { flex-basis: 100%; }
}
@media (prefers-reduced-motion: reduce) {
  .easy-search-card,
  .easy-search-chevron,
  .easy-search-mode { transition: none; }
}
`;
		function installStyles() {
			if (document.getElementById(STYLE_ID) !== null) return () => {};
			const style = document.createElement("style");
			style.id = STYLE_ID;
			style.dataset.plugin = "@aisa-plugins/easy-search";
			style.textContent = CSS;
			document.head.append(style);
			return () => {
				style.remove();
			};
		}
		//#endregion
		//#region src/client/index.tsx
		const name = "client-ui-easy-search";
		const inject = [
			"slots",
			"locale",
			"connection",
			"remote",
			"settingsScope"
		];
		function apply(ctx) {
			const { api } = ctx.get("connection");
			const controller = new EasySearchCardController(ctx.settingsScope.bind({ namespace: "easy-search" }), api);
			ctx.effect(() => ctx.locale.register(EASY_SEARCH_LOCALE_NAMESPACE, {
				zh,
				en
			}), "easy-search: locale");
			ctx.effect(installStyles, "easy-search: styles");
			ctx.effect(() => () => {
				controller.dispose();
			}, "easy-search: controller");
			ctx.effect(() => ctx.remote.$on("credentials/reference-updated", (ref) => {
				controller.refreshCredential(ref);
			}), "easy-search: credential invalidation");
			ctx.slots.inject("settings.plugin.item", () => ctx.slots.register({
				name: "settings.plugin.item",
				key: "easy-search",
				priority: 30,
				locale: EASY_SEARCH_LOCALE_NAMESPACE,
				inject: () => controller.inject()
			}, EasySearchCard));
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		exports.name = name;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map