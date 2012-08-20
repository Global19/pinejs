define(["ometa-core"], (function() {
    var ClientURIParser = OMeta._extend({
        "word": function() {
            var l, _fromIdx = this.input.idx,
                $elf = this;
            l = this._many1((function() {
                return this._or((function() {
                    return this._apply("letter")
                }), (function() {
                    return (function() {
                        switch (this._apply('anything')) {
                        case "_":
                            return "_";
                        case "-":
                            return "-";
                        default:
                            throw this._fail()
                        }
                    }).call(this)
                }))
            }));
            return l.join("")
        },
        "number": function() {
            var d, _fromIdx = this.input.idx,
                $elf = this;
            d = this._consumedBy((function() {
                return this._many1((function() {
                    return this._apply("digit")
                }))
            }));
            return parseInt(d, (10))
        },
        "part": function() {
            var l, _fromIdx = this.input.idx,
                $elf = this;
            l = this._many1((function() {
                return this._or((function() {
                    return this._apply("letter")
                }), (function() {
                    return this._apply("digit")
                }), (function() {
                    return (function() {
                        switch (this._apply('anything')) {
                        case "_":
                            return "_";
                        case "-":
                            return "-";
                        default:
                            throw this._fail()
                        }
                    }).call(this)
                }))
            }));
            return l.join("")
        },
        "parm": function() {
            var o, t, _fromIdx = this.input.idx,
                v, $elf = this,
                f;
            t = this._apply("part");
            f = this._or((function() {
                return (function() {
                    switch (this._apply('anything')) {
                    case ".":
                        return (function() {
                            o = this._apply("word");
                            return o
                        }).call(this);
                    default:
                        throw this._fail()
                    }
                }).call(this)
            }), (function() {
                return (function() {
                    (f = t);
                    (t = []);
                    return f
                }).call(this)
            }));
            o = (function() {
                switch (this._apply('anything')) {
                case "=":
                    return "eq";
                case "!":
                    return (function() {
                        this._applyWithArgs("exactly", "=");
                        "!=";
                        return "ne"
                    }).call(this);
                case "~":
                    return "lk";
                default:
                    throw this._fail()
                }
            }).call(this);
            v = this._apply("part");
            this._opt((function() {
                return this._applyWithArgs("exactly", ";")
            }));
            return [o, t, f, v]
        },
        "imod": function() {
            var _fromIdx = this.input.idx,
                $elf = this;
            return (function() {
                switch (this._apply('anything')) {
                case "e":
                    return (function() {
                        this._applyWithArgs("exactly", "d");
                        this._applyWithArgs("exactly", "i");
                        this._applyWithArgs("exactly", "t");
                        return "edit"
                    }).call(this);
                case "v":
                    return (function() {
                        this._applyWithArgs("exactly", "i");
                        this._applyWithArgs("exactly", "e");
                        this._applyWithArgs("exactly", "w");
                        return "view"
                    }).call(this);
                case "a":
                    return (function() {
                        this._applyWithArgs("exactly", "d");
                        this._applyWithArgs("exactly", "d");
                        return "add"
                    }).call(this);
                case "d":
                    return (function() {
                        this._applyWithArgs("exactly", "e");
                        this._applyWithArgs("exactly", "l");
                        return "del"
                    }).call(this);
                default:
                    throw this._fail()
                }
            }).call(this)
        },
        "cmod": function() {
            var _fromIdx = this.input.idx,
                $elf = this;
            return (function() {
                switch (this._apply('anything')) {
                case "f":
                    return (function() {
                        this._applyWithArgs("exactly", "i");
                        this._applyWithArgs("exactly", "l");
                        this._applyWithArgs("exactly", "t");
                        return "filt"
                    }).call(this);
                case "s":
                    return (function() {
                        this._applyWithArgs("exactly", "o");
                        this._applyWithArgs("exactly", "r");
                        this._applyWithArgs("exactly", "t");
                        return "sort"
                    }).call(this);
                case "d":
                    return (function() {
                        this._applyWithArgs("exactly", "e");
                        this._applyWithArgs("exactly", "l");
                        return "del"
                    }).call(this);
                default:
                    throw this._fail()
                }
            }).call(this)
        },
        "iact": function() {
            var a, _fromIdx = this.input.idx,
                $elf = this,
                p;
            return this._or((function() {
                return this._many1((function() {
                    this._applyWithArgs("exactly", "*");
                    a = this._apply("imod");
                    p = this._or((function() {
                        return (function() {
                            switch (this._apply('anything')) {
                            case ":":
                                return this._many1((function() {
                                    return this._apply("parm")
                                }));
                            default:
                                throw this._fail()
                            }
                        }).call(this)
                    }), (function() {
                        return []
                    }));
                    return [a].concat(p)
                }))
            }), (function() {
                return []
            }))
        },
        "cact": function() {
            var a, _fromIdx = this.input.idx,
                $elf = this,
                p;
            return this._or((function() {
                return this._many1((function() {
                    this._applyWithArgs("exactly", "*");
                    a = this._apply("cmod");
                    p = this._or((function() {
                        return (function() {
                            switch (this._apply('anything')) {
                            case ":":
                                return this._many1((function() {
                                    return this._apply("parm")
                                }));
                            default:
                                throw this._fail()
                            }
                        }).call(this)
                    }), (function() {
                        return []
                    }));
                    return [a].concat(p)
                }))
            }), (function() {
                return []
            }))
        },
        "cole": function() {
            var t, _fromIdx = this.input.idx,
                $elf = this,
                s;
            t = this._apply("part");
            s = this._apply("cact");
            return [[t]].concat([
                ["mod"].concat(s)])
        },
        "inst": function() {
            var t, _fromIdx = this.input.idx,
                $elf = this,
                s, f;
            return this._or((function() {
                t = this._apply("part");
                this._applyWithArgs("exactly", ".");
                f = this._apply("word");
                s = this._apply("iact");
                return [[t, f]].concat([
                    ["mod"].concat([
                        ["filt", ["eq", [], "name", f]]
                    ]).concat(s)])
            }), (function() {
                t = this._apply("part");
                this._applyWithArgs("exactly", ".");
                f = this._apply("number");
                s = this._apply("iact");
                return [[t, f]].concat([
                    ["mod"].concat([
                        ["filt", ["eq", [], "id", f]]
                    ]).concat(s)])
            }), (function() {
                t = this._apply("part");
                s = this._apply("iact");
                return [[t]].concat([
                    ["mod"].concat(s)])
            }))
        },
        "frbd": function() {
            var r, _fromIdx = this.input.idx,
                $elf = this,
                f, g;
            f = this._or((function() {
                this._opt((function() {
                    return this._applyWithArgs("exactly", "/")
                }));
                f = this._apply("frag");
                return [f]
            }), (function() {
                this._opt((function() {
                    return this._applyWithArgs("exactly", "/")
                }));
                this._applyWithArgs("exactly", "(");
                r = this._many1((function() {
                    g = this._apply("frag");
                    this._opt((function() {
                        return this._applyWithArgs("exactly", ",")
                    }));
                    return g
                }));
                this._applyWithArgs("exactly", ")");
                return r
            }), (function() {
                this._opt((function() {
                    return this._applyWithArgs("exactly", "/")
                }));
                return []
            }));
            this._lookahead((function() {
                return this._or((function() {
                    return this._apply("end")
                }), (function() {
                    return (function() {
                        switch (this._apply('anything')) {
                        case ")":
                            return ")";
                        case "/":
                            return "/";
                        case ",":
                            return ",";
                        default:
                            throw this._fail()
                        }
                    }).call(this)
                }))
            }));
            return f
        },
        "frag": function() {
            var w, _fromIdx = this.input.idx,
                $elf = this,
                f;
            return this._or((function() {
                w = this._apply("cole");
                f = this._apply("frbd");
                return ["collection"].concat(w.concat(f))
            }), (function() {
                w = this._apply("inst");
                f = this._apply("frbd");
                return ["instance"].concat(w.concat(f))
            }))
        },
        "expr": function() {
            var _fromIdx = this.input.idx,
                $elf = this,
                f;
            return this._or((function() {
                return (function() {
                    switch (this._apply('anything')) {
                    case "#":
                        return (function() {
                            this._applyWithArgs("exactly", "!");
                            this._applyWithArgs("exactly", "/");
                            "#!/";
                            f = this._apply("frag");
                            this._apply("end");
                            f = f;
                            return ["uri", f]
                        }).call(this);
                    default:
                        throw this._fail()
                    }
                }).call(this)
            }), (function() {
                this._apply("empty");
                return []
            }))
        }
    });
    return ClientURIParser
}))