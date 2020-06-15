;/* Chosen v1.1.0 | (c) 2011-2013 by Harvest | MIT License, https://github.com/harvesthq/chosen/blob/master/LICENSE.md */
!function() {
    var a, AbstractChosen, Chosen, SelectParser, b, c = {}.hasOwnProperty, d = function(a, b) {
        function d() {
            this.constructor = a
        }
        for (var e in b)
            c.call(b, e) && (a[e] = b[e]);
        return d.prototype = b.prototype,
        a.prototype = new d,
        a.__super__ = b.prototype,
        a
    };
    SelectParser = function() {
        function SelectParser() {
            this.options_index = 0,
            this.parsed = []
        }
        return SelectParser.prototype.add_node = function(a) {
            return "OPTGROUP" === a.nodeName.toUpperCase() ? this.add_group(a) : this.add_option(a)
        }
        ,
        SelectParser.prototype.add_group = function(a) {
            var b, c, d, e, f, g;
            for (b = this.parsed.length,
            this.parsed.push({
                array_index: b,
                group: !0,
                label: this.escapeExpression(a.label),
                children: 0,
                disabled: a.disabled
            }),
            f = a.childNodes,
            g = [],
            d = 0,
            e = f.length; e > d; d++)
                c = f[d],
                g.push(this.add_option(c, b, a.disabled));
            return g
        }
        ,
        SelectParser.prototype.add_option = function(a, b, c) {
            return "OPTION" === a.nodeName.toUpperCase() ? ("" !== a.text ? (null != b && (this.parsed[b].children += 1),
            this.parsed.push({
                array_index: this.parsed.length,
                options_index: this.options_index,
                value: a.value,
                text: a.text,
                html: a.innerHTML,
                selected: a.selected,
                disabled: c === !0 ? c : a.disabled,
                group_array_index: b,
                classes: a.className,
                style: a.style.cssText
            })) : this.parsed.push({
                array_index: this.parsed.length,
                options_index: this.options_index,
                empty: !0
            }),
            this.options_index += 1) : void 0
        }
        ,
        SelectParser.prototype.escapeExpression = function(a) {
            var b, c;
            return null == a || a === !1 ? "" : /[\&\<\>\"\'\`]/.test(a) ? (b = {
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#x27;",
                "`": "&#x60;"
            },
            c = /&(?!\w+;)|[\<\>\"\'\`]/g,
            a.replace(c, function(a) {
                return b[a] || "&amp;"
            })) : a
        }
        ,
        SelectParser
    }(),
    SelectParser.select_to_array = function(a) {
        var b, c, d, e, f;
        for (c = new SelectParser,
        f = a.childNodes,
        d = 0,
        e = f.length; e > d; d++)
            b = f[d],
            c.add_node(b);
        return c.parsed
    }
    ,
    AbstractChosen = function() {
        function AbstractChosen(a, b) {
            this.form_field = a,
            this.options = null != b ? b : {},
            AbstractChosen.browser_is_supported() && (this.is_multiple = this.form_field.multiple,
            this.set_default_text(),
            this.set_default_values(),
            this.setup(),
            this.set_up_html(),
            this.register_observers())
        }
        return AbstractChosen.prototype.set_default_values = function() {
            var a = this;
            return this.click_test_action = function(b) {
                return a.test_active_click(b)
            }
            ,
            this.activate_action = function(b) {
                return a.activate_field(b)
            }
            ,
            this.active_field = !1,
            this.mouse_on_container = !1,
            this.results_showing = !1,
            this.result_highlighted = null,
            this.allow_single_deselect = null != this.options.allow_single_deselect && null != this.form_field.options[0] && "" === this.form_field.options[0].text ? this.options.allow_single_deselect : !1,
            this.disable_search_threshold = this.options.disable_search_threshold || 0,
            this.disable_search = this.options.disable_search || !1,
            this.enable_split_word_search = null != this.options.enable_split_word_search ? this.options.enable_split_word_search : !0,
            this.group_search = null != this.options.group_search ? this.options.group_search : !0,
            this.search_contains = this.options.search_contains || !1,
            this.single_backstroke_delete = null != this.options.single_backstroke_delete ? this.options.single_backstroke_delete : !0,
            this.max_selected_options = this.options.max_selected_options || 1 / 0,
            this.inherit_select_classes = this.options.inherit_select_classes || !1,
            this.display_selected_options = null != this.options.display_selected_options ? this.options.display_selected_options : !0,
            this.display_disabled_options = null != this.options.display_disabled_options ? this.options.display_disabled_options : !0
        }
        ,
        AbstractChosen.prototype.set_default_text = function() {
            return this.default_text = this.form_field.getAttribute("data-placeholder") ? this.form_field.getAttribute("data-placeholder") : this.is_multiple ? this.options.placeholder_text_multiple || this.options.placeholder_text || AbstractChosen.default_multiple_text : this.options.placeholder_text_single || this.options.placeholder_text || AbstractChosen.default_single_text,
            this.results_none_found = this.form_field.getAttribute("data-no_results_text") || this.options.no_results_text || AbstractChosen.default_no_result_text
        }
        ,
        AbstractChosen.prototype.mouse_enter = function() {
            return this.mouse_on_container = !0
        }
        ,
        AbstractChosen.prototype.mouse_leave = function() {
            return this.mouse_on_container = !1
        }
        ,
        AbstractChosen.prototype.input_focus = function() {
            var a = this;
            if (this.is_multiple) {
                if (!this.active_field)
                    return setTimeout(function() {
                        return a.container_mousedown()
                    }, 50)
            } else if (!this.active_field)
                return this.activate_field()
        }
        ,
        AbstractChosen.prototype.input_blur = function() {
            var a = this;
            return this.mouse_on_container ? void 0 : (this.active_field = !1,
            setTimeout(function() {
                return a.blur_test()
            }, 100))
        }
        ,
        AbstractChosen.prototype.results_option_build = function(a) {
            var b, c, d, e, f;
            for (b = "",
            f = this.results_data,
            d = 0,
            e = f.length; e > d; d++)
                c = f[d],
                b += c.group ? this.result_add_group(c) : this.result_add_option(c),
                (null != a ? a.first : void 0) && (c.selected && this.is_multiple ? this.choice_build(c) : c.selected && !this.is_multiple && this.single_set_selected_text(c.text));
            return b
        }
        ,
        AbstractChosen.prototype.result_add_option = function(a) {
            var b, c;
            return a.search_match ? this.include_option_in_results(a) ? (b = [],
            a.disabled || a.selected && this.is_multiple || b.push("active-result"),
            !a.disabled || a.selected && this.is_multiple || b.push("disabled-result"),
            a.selected && b.push("result-selected"),
            null != a.group_array_index && b.push("group-option"),
            "" !== a.classes && b.push(a.classes),
            c = document.createElement("li"),
            c.className = b.join(" "),
            c.style.cssText = a.style,
            c.setAttribute("data-option-array-index", a.array_index),
            c.innerHTML = a.search_text,
            this.outerHTML(c)) : "" : ""
        }
        ,
        AbstractChosen.prototype.result_add_group = function(a) {
            var b;
            return a.search_match || a.group_match ? a.active_options > 0 ? (b = document.createElement("li"),
            b.className = "group-result",
            b.innerHTML = a.search_text,
            this.outerHTML(b)) : "" : ""
        }
        ,
        AbstractChosen.prototype.results_update_field = function() {
            return this.set_default_text(),
            this.is_multiple || this.results_reset_cleanup(),
            this.result_clear_highlight(),
            this.results_build(),
            this.results_showing ? this.winnow_results() : void 0
        }
        ,
        AbstractChosen.prototype.reset_single_select_options = function() {
            var a, b, c, d, e;
            for (d = this.results_data,
            e = [],
            b = 0,
            c = d.length; c > b; b++)
                a = d[b],
                a.selected ? e.push(a.selected = !1) : e.push(void 0);
            return e
        }
        ,
        AbstractChosen.prototype.results_toggle = function() {
            return this.results_showing ? this.results_hide() : this.results_show()
        }
        ,
        AbstractChosen.prototype.results_search = function() {
            return this.results_showing ? this.winnow_results() : this.results_show()
        }
        ,
        AbstractChosen.prototype.winnow_results = function() {
            var a, b, c, d, e, f, g, h, i, j, k, l, m;
            for (this.no_results_clear(),
            e = 0,
            g = this.get_search_text(),
            a = g.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"),
            d = this.search_contains ? "" : "^",
            c = new RegExp(d + a,"i"),
            j = new RegExp(a,"i"),
            m = this.results_data,
            k = 0,
            l = m.length; l > k; k++)
                b = m[k],
                b.search_match = !1,
                f = null,
                this.include_option_in_results(b) && (b.group && (b.group_match = !1,
                b.active_options = 0),
                null != b.group_array_index && this.results_data[b.group_array_index] && (f = this.results_data[b.group_array_index],
                0 === f.active_options && f.search_match && (e += 1),
                f.active_options += 1),
                (!b.group || this.group_search) && (b.search_text = b.group ? b.label : b.html,
                b.search_match = this.search_string_match(b.search_text, c),
                b.search_match && !b.group && (e += 1),
                b.search_match ? (g.length && (h = b.search_text.search(j),
                i = b.search_text.substr(0, h + g.length) + "</em>" + b.search_text.substr(h + g.length),
                b.search_text = i.substr(0, h) + "<em>" + i.substr(h)),
                null != f && (f.group_match = !0)) : null != b.group_array_index && this.results_data[b.group_array_index].search_match && (b.search_match = !0)));
            return this.result_clear_highlight(),
            1 > e && g.length ? (this.update_results_content(""),
            this.no_results(g)) : (this.update_results_content(this.results_option_build()),
            this.winnow_results_set_highlight())
        }
        ,
        AbstractChosen.prototype.search_string_match = function(a, b) {
            var c, d, e, f;
            if (b.test(a))
                return !0;
            if (this.enable_split_word_search && (a.indexOf(" ") >= 0 || 0 === a.indexOf("[")) && (d = a.replace(/\[|\]/g, "").split(" "),
            d.length))
                for (e = 0,
                f = d.length; f > e; e++)
                    if (c = d[e],
                    b.test(c))
                        return !0
        }
        ,
        AbstractChosen.prototype.choices_count = function() {
            var a, b, c, d;
            if (null != this.selected_option_count)
                return this.selected_option_count;
            for (this.selected_option_count = 0,
            d = this.form_field.options,
            b = 0,
            c = d.length; c > b; b++)
                a = d[b],
                a.selected && (this.selected_option_count += 1);
            return this.selected_option_count
        }
        ,
        AbstractChosen.prototype.choices_click = function(a) {
            return a.preventDefault(),
            this.results_showing || this.is_disabled ? void 0 : this.results_show()
        }
        ,
        AbstractChosen.prototype.keyup_checker = function(a) {
            var b, c;
            switch (b = null != (c = a.which) ? c : a.keyCode,
            this.search_field_scale(),
            b) {
            case 8:
                if (this.is_multiple && this.backstroke_length < 1 && this.choices_count() > 0)
                    return this.keydown_backstroke();
                if (!this.pending_backstroke)
                    return this.result_clear_highlight(),
                    this.results_search();
                break;
            case 13:
                if (a.preventDefault(),
                this.results_showing)
                    return this.result_select(a);
                break;
            case 27:
                return this.results_showing && this.results_hide(),
                !0;
            case 9:
            case 38:
            case 40:
            case 16:
            case 91:
            case 17:
                break;
            default:
                return this.results_search()
            }
        }
        ,
        AbstractChosen.prototype.clipboard_event_checker = function() {
            var a = this;
            return setTimeout(function() {
                return a.results_search()
            }, 50)
        }
        ,
        AbstractChosen.prototype.container_width = function() {
            return null != this.options.width ? this.options.width : "" + this.form_field.offsetWidth + "px"
        }
        ,
        AbstractChosen.prototype.include_option_in_results = function(a) {
            return this.is_multiple && !this.display_selected_options && a.selected ? !1 : !this.display_disabled_options && a.disabled ? !1 : a.empty ? !1 : !0
        }
        ,
        AbstractChosen.prototype.search_results_touchstart = function(a) {
            return this.touch_started = !0,
            this.search_results_mouseover(a)
        }
        ,
        AbstractChosen.prototype.search_results_touchmove = function(a) {
            return this.touch_started = !1,
            this.search_results_mouseout(a)
        }
        ,
        AbstractChosen.prototype.search_results_touchend = function(a) {
            return this.touch_started ? this.search_results_mouseup(a) : void 0
        }
        ,
        AbstractChosen.prototype.outerHTML = function(a) {
            var b;
            return a.outerHTML ? a.outerHTML : (b = document.createElement("div"),
            b.appendChild(a),
            b.innerHTML)
        }
        ,
        AbstractChosen.browser_is_supported = function() {
            return "Microsoft Internet Explorer" === window.navigator.appName ? document.documentMode >= 8 : /iP(od|hone)/i.test(window.navigator.userAgent) ? !1 : /Android/i.test(window.navigator.userAgent) && /Mobile/i.test(window.navigator.userAgent) ? !1 : !0
        }
        ,
        AbstractChosen.default_multiple_text = "Select Some Options",
        AbstractChosen.default_single_text = "Select an Option",
        AbstractChosen.default_no_result_text = "No results match",
        AbstractChosen
    }(),
    a = jQuery,
    a.fn.extend({
        chosen: function(b) {
            return AbstractChosen.browser_is_supported() ? this.each(function() {
                var c, d;
                c = a(this),
                d = c.data("chosen"),
                "destroy" === b && d ? d.destroy() : d || c.data("chosen", new Chosen(this,b))
            }) : this
        }
    }),
    Chosen = function(c) {
        function Chosen() {
            return b = Chosen.__super__.constructor.apply(this, arguments)
        }
        return d(Chosen, c),
        Chosen.prototype.setup = function() {
            return this.form_field_jq = a(this.form_field),
            this.current_selectedIndex = this.form_field.selectedIndex,
            this.is_rtl = this.form_field_jq.hasClass("chosen-rtl")
        }
        ,
        Chosen.prototype.set_up_html = function() {
            var b, c;
            return b = ["chosen-container"],
            b.push("chosen-container-" + (this.is_multiple ? "multi" : "single")),
            this.inherit_select_classes && this.form_field.className && b.push(this.form_field.className),
            this.is_rtl && b.push("chosen-rtl"),
            c = {
                "class": b.join(" "),
                style: "width: " + this.container_width() + ";",
                title: this.form_field.title
            },
            this.form_field.id.length && (c.id = this.form_field.id.replace(/[^\w]/g, "_") + "_chosen"),
            this.container = a("<div />", c),
            this.is_multiple ? this.container.html('<ul class="chosen-choices"><li class="search-field"><input type="text" value="' + this.default_text + '" class="default" autocomplete="off" style="width:25px;" /></li></ul><div class="chosen-drop"><ul class="chosen-results"></ul></div>') : this.container.html('<a class="chosen-single chosen-default" tabindex="-1"><span>' + this.default_text + '</span><div><b></b></div></a><div class="chosen-drop"><div class="chosen-search"><input type="text" autocomplete="off" /></div><ul class="chosen-results"></ul></div>'),
            this.form_field_jq.hide().after(this.container),
            this.dropdown = this.container.find("div.chosen-drop").first(),
            this.search_field = this.container.find("input").first(),
            this.search_results = this.container.find("ul.chosen-results").first(),
            this.search_field_scale(),
            this.search_no_results = this.container.find("li.no-results").first(),
            this.is_multiple ? (this.search_choices = this.container.find("ul.chosen-choices").first(),
            this.search_container = this.container.find("li.search-field").first()) : (this.search_container = this.container.find("div.chosen-search").first(),
            this.selected_item = this.container.find(".chosen-single").first()),
            this.results_build(),
            this.set_tab_index(),
            this.set_label_behavior(),
            this.form_field_jq.trigger("chosen:ready", {
                chosen: this
            })
        }
        ,
        Chosen.prototype.register_observers = function() {
            var a = this;
            return this.container.bind("mousedown.chosen", function(b) {
                a.container_mousedown(b)
            }),
            this.container.bind("mouseup.chosen", function(b) {
                a.container_mouseup(b)
            }),
            this.container.bind("mouseenter.chosen", function(b) {
                a.mouse_enter(b)
            }),
            this.container.bind("mouseleave.chosen", function(b) {
                a.mouse_leave(b)
            }),
            this.search_results.bind("mouseup.chosen", function(b) {
                a.search_results_mouseup(b)
            }),
            this.search_results.bind("mouseover.chosen", function(b) {
                a.search_results_mouseover(b)
            }),
            this.search_results.bind("mouseout.chosen", function(b) {
                a.search_results_mouseout(b)
            }),
            this.search_results.bind("mousewheel.chosen DOMMouseScroll.chosen", function(b) {
                a.search_results_mousewheel(b)
            }),
            this.search_results.bind("touchstart.chosen", function(b) {
                a.search_results_touchstart(b)
            }),
            this.search_results.bind("touchmove.chosen", function(b) {
                a.search_results_touchmove(b)
            }),
            this.search_results.bind("touchend.chosen", function(b) {
                a.search_results_touchend(b)
            }),
            this.form_field_jq.bind("chosen:updated.chosen", function(b) {
                a.results_update_field(b)
            }),
            this.form_field_jq.bind("chosen:activate.chosen", function(b) {
                a.activate_field(b)
            }),
            this.form_field_jq.bind("chosen:open.chosen", function(b) {
                a.container_mousedown(b)
            }),
            this.form_field_jq.bind("chosen:close.chosen", function(b) {
                a.input_blur(b)
            }),
            this.search_field.bind("blur.chosen", function(b) {
                a.input_blur(b)
            }),
            this.search_field.bind("keyup.chosen", function(b) {
                a.keyup_checker(b)
            }),
            this.search_field.bind("keydown.chosen", function(b) {
                a.keydown_checker(b)
            }),
            this.search_field.bind("focus.chosen", function(b) {
                a.input_focus(b)
            }),
            this.search_field.bind("cut.chosen", function(b) {
                a.clipboard_event_checker(b)
            }),
            this.search_field.bind("paste.chosen", function(b) {
                a.clipboard_event_checker(b)
            }),
            this.is_multiple ? this.search_choices.bind("click.chosen", function(b) {
                a.choices_click(b)
            }) : this.container.bind("click.chosen", function(a) {
                a.preventDefault()
            })
        }
        ,
        Chosen.prototype.destroy = function() {
            return a(this.container[0].ownerDocument).unbind("click.chosen", this.click_test_action),
            this.search_field[0].tabIndex && (this.form_field_jq[0].tabIndex = this.search_field[0].tabIndex),
            this.container.remove(),
            this.form_field_jq.removeData("chosen"),
            this.form_field_jq.show()
        }
        ,
        Chosen.prototype.search_field_disabled = function() {
            return this.is_disabled = this.form_field_jq[0].disabled,
            this.is_disabled ? (this.container.addClass("chosen-disabled"),
            this.search_field[0].disabled = !0,
            this.is_multiple || this.selected_item.unbind("focus.chosen", this.activate_action),
            this.close_field()) : (this.container.removeClass("chosen-disabled"),
            this.search_field[0].disabled = !1,
            this.is_multiple ? void 0 : this.selected_item.bind("focus.chosen", this.activate_action))
        }
        ,
        Chosen.prototype.container_mousedown = function(b) {
            return this.is_disabled || (b && "mousedown" === b.type && !this.results_showing && b.preventDefault(),
            null != b && a(b.target).hasClass("search-choice-close")) ? void 0 : (this.active_field ? this.is_multiple || !b || a(b.target)[0] !== this.selected_item[0] && !a(b.target).parents("a.chosen-single").length || (b.preventDefault(),
            this.results_toggle()) : (this.is_multiple && this.search_field.val(""),
            a(this.container[0].ownerDocument).bind("click.chosen", this.click_test_action),
            this.results_show()),
            this.activate_field())
        }
        ,
        Chosen.prototype.container_mouseup = function(a) {
            return "ABBR" !== a.target.nodeName || this.is_disabled ? void 0 : this.results_reset(a)
        }
        ,
        Chosen.prototype.search_results_mousewheel = function(a) {
            var b;
            return a.originalEvent && (b = -a.originalEvent.wheelDelta || a.originalEvent.detail),
            null != b ? (a.preventDefault(),
            "DOMMouseScroll" === a.type && (b = 40 * b),
            this.search_results.scrollTop(b + this.search_results.scrollTop())) : void 0
        }
        ,
        Chosen.prototype.blur_test = function() {
            return !this.active_field && this.container.hasClass("chosen-container-active") ? this.close_field() : void 0
        }
        ,
        Chosen.prototype.close_field = function() {
            return a(this.container[0].ownerDocument).unbind("click.chosen", this.click_test_action),
            this.active_field = !1,
            this.results_hide(),
            this.container.removeClass("chosen-container-active"),
            this.clear_backstroke(),
            this.show_search_field_default(),
            this.search_field_scale()
        }
        ,
        Chosen.prototype.activate_field = function() {
            return this.container.addClass("chosen-container-active"),
            this.active_field = !0,
            this.search_field.val(this.search_field.val()),
            this.search_field.focus()
        }
        ,
        Chosen.prototype.test_active_click = function(b) {
            var c;
            return c = a(b.target).closest(".chosen-container"),
            c.length && this.container[0] === c[0] ? this.active_field = !0 : this.close_field()
        }
        ,
        Chosen.prototype.results_build = function() {
            return this.parsing = !0,
            this.selected_option_count = null,
            this.results_data = SelectParser.select_to_array(this.form_field),
            this.is_multiple ? this.search_choices.find("li.search-choice").remove() : this.is_multiple || (this.single_set_selected_text(),
            this.disable_search || this.form_field.options.length <= this.disable_search_threshold ? (this.search_field[0].readOnly = !0,
            this.container.addClass("chosen-container-single-nosearch")) : (this.search_field[0].readOnly = !1,
            this.container.removeClass("chosen-container-single-nosearch"))),
            this.update_results_content(this.results_option_build({
                first: !0
            })),
            this.search_field_disabled(),
            this.show_search_field_default(),
            this.search_field_scale(),
            this.parsing = !1
        }
        ,
        Chosen.prototype.result_do_highlight = function(a) {
            var b, c, d, e, f;
            if (a.length) {
                if (this.result_clear_highlight(),
                this.result_highlight = a,
                this.result_highlight.addClass("highlighted"),
                d = parseInt(this.search_results.css("maxHeight"), 10),
                f = this.search_results.scrollTop(),
                e = d + f,
                c = this.result_highlight.position().top + this.search_results.scrollTop(),
                b = c + this.result_highlight.outerHeight(),
                b >= e)
                    return this.search_results.scrollTop(b - d > 0 ? b - d : 0);
                if (f > c)
                    return this.search_results.scrollTop(c)
            }
        }
        ,
        Chosen.prototype.result_clear_highlight = function() {
            return this.result_highlight && this.result_highlight.removeClass("highlighted"),
            this.result_highlight = null
        }
        ,
        Chosen.prototype.results_show = function() {
            return this.is_multiple && this.max_selected_options <= this.choices_count() ? (this.form_field_jq.trigger("chosen:maxselected", {
                chosen: this
            }),
            !1) : (this.container.addClass("chosen-with-drop"),
            this.results_showing = !0,
            this.search_field.focus(),
            this.search_field.val(this.search_field.val()),
            this.winnow_results(),
            this.form_field_jq.trigger("chosen:showing_dropdown", {
                chosen: this
            }))
        }
        ,
        Chosen.prototype.update_results_content = function(a) {
            return this.search_results.html(a)
        }
        ,
        Chosen.prototype.results_hide = function() {
            return this.results_showing && (this.result_clear_highlight(),
            this.container.removeClass("chosen-with-drop"),
            this.form_field_jq.trigger("chosen:hiding_dropdown", {
                chosen: this
            })),
            this.results_showing = !1
        }
        ,
        Chosen.prototype.set_tab_index = function() {
            var a;
            return this.form_field.tabIndex ? (a = this.form_field.tabIndex,
            this.form_field.tabIndex = -1,
            this.search_field[0].tabIndex = a) : void 0
        }
        ,
        Chosen.prototype.set_label_behavior = function() {
            var b = this;
            return this.form_field_label = this.form_field_jq.parents("label"),
            !this.form_field_label.length && this.form_field.id.length && (this.form_field_label = a("label[for='" + this.form_field.id + "']")),
            this.form_field_label.length > 0 ? this.form_field_label.bind("click.chosen", function(a) {
                return b.is_multiple ? b.container_mousedown(a) : b.activate_field()
            }) : void 0
        }
        ,
        Chosen.prototype.show_search_field_default = function() {
            return this.is_multiple && this.choices_count() < 1 && !this.active_field ? (this.search_field.val(this.default_text),
            this.search_field.addClass("default")) : (this.search_field.val(""),
            this.search_field.removeClass("default"))
        }
        ,
        Chosen.prototype.search_results_mouseup = function(b) {
            var c;
            return c = a(b.target).hasClass("active-result") ? a(b.target) : a(b.target).parents(".active-result").first(),
            c.length ? (this.result_highlight = c,
            this.result_select(b),
            this.search_field.focus()) : void 0
        }
        ,
        Chosen.prototype.search_results_mouseover = function(b) {
            var c;
            return c = a(b.target).hasClass("active-result") ? a(b.target) : a(b.target).parents(".active-result").first(),
            c ? this.result_do_highlight(c) : void 0
        }
        ,
        Chosen.prototype.search_results_mouseout = function(b) {
            return a(b.target).hasClass("active-result") ? this.result_clear_highlight() : void 0
        }
        ,
        Chosen.prototype.choice_build = function(b) {
            var c, d, e = this;
            return c = a("<li />", {
                "class": "search-choice"
            }).html("<span>" + b.html + "</span>"),
            b.disabled ? c.addClass("search-choice-disabled") : (d = a("<a />", {
                "class": "search-choice-close",
                "data-option-array-index": b.array_index
            }),
            d.bind("click.chosen", function(a) {
                return e.choice_destroy_link_click(a)
            }),
            c.append(d)),
            this.search_container.before(c)
        }
        ,
        Chosen.prototype.choice_destroy_link_click = function(b) {
            return b.preventDefault(),
            b.stopPropagation(),
            this.is_disabled ? void 0 : this.choice_destroy(a(b.target))
        }
        ,
        Chosen.prototype.choice_destroy = function(a) {
            return this.result_deselect(a[0].getAttribute("data-option-array-index")) ? (this.show_search_field_default(),
            this.is_multiple && this.choices_count() > 0 && this.search_field.val().length < 1 && this.results_hide(),
            a.parents("li").first().remove(),
            this.search_field_scale()) : void 0
        }
        ,
        Chosen.prototype.results_reset = function() {
            return this.reset_single_select_options(),
            this.form_field.options[0].selected = !0,
            this.single_set_selected_text(),
            this.show_search_field_default(),
            this.results_reset_cleanup(),
            this.form_field_jq.trigger("change"),
            this.active_field ? this.results_hide() : void 0
        }
        ,
        Chosen.prototype.results_reset_cleanup = function() {
            return this.current_selectedIndex = this.form_field.selectedIndex,
            this.selected_item.find("abbr").remove()
        }
        ,
        Chosen.prototype.result_select = function(a) {
            var b, c;
            return this.result_highlight ? (b = this.result_highlight,
            this.result_clear_highlight(),
            this.is_multiple && this.max_selected_options <= this.choices_count() ? (this.form_field_jq.trigger("chosen:maxselected", {
                chosen: this
            }),
            !1) : (this.is_multiple ? b.removeClass("active-result") : this.reset_single_select_options(),
            c = this.results_data[b[0].getAttribute("data-option-array-index")],
            c.selected = !0,
            this.form_field.options[c.options_index].selected = !0,
            this.selected_option_count = null,
            this.is_multiple ? this.choice_build(c) : this.single_set_selected_text(c.text),
            (a.metaKey || a.ctrlKey) && this.is_multiple || this.results_hide(),
            this.search_field.val(""),
            (this.is_multiple || this.form_field.selectedIndex !== this.current_selectedIndex) && this.form_field_jq.trigger("change", {
                selected: this.form_field.options[c.options_index].value
            }),
            this.current_selectedIndex = this.form_field.selectedIndex,
            this.search_field_scale())) : void 0
        }
        ,
        Chosen.prototype.single_set_selected_text = function(a) {
            return null == a && (a = this.default_text),
            a === this.default_text ? this.selected_item.addClass("chosen-default") : (this.single_deselect_control_build(),
            this.selected_item.removeClass("chosen-default")),
            this.selected_item.find("span").text(a)
        }
        ,
        Chosen.prototype.result_deselect = function(a) {
            var b;
            return b = this.results_data[a],
            this.form_field.options[b.options_index].disabled ? !1 : (b.selected = !1,
            this.form_field.options[b.options_index].selected = !1,
            this.selected_option_count = null,
            this.result_clear_highlight(),
            this.results_showing && this.winnow_results(),
            this.form_field_jq.trigger("change", {
                deselected: this.form_field.options[b.options_index].value
            }),
            this.search_field_scale(),
            !0)
        }
        ,
        Chosen.prototype.single_deselect_control_build = function() {
            return this.allow_single_deselect ? (this.selected_item.find("abbr").length || this.selected_item.find("span").first().after('<abbr class="search-choice-close"></abbr>'),
            this.selected_item.addClass("chosen-single-with-deselect")) : void 0
        }
        ,
        Chosen.prototype.get_search_text = function() {
            return this.search_field.val() === this.default_text ? "" : a("<div/>").text(a.trim(this.search_field.val())).html()
        }
        ,
        Chosen.prototype.winnow_results_set_highlight = function() {
            var a, b;
            return b = this.is_multiple ? [] : this.search_results.find(".result-selected.active-result"),
            a = b.length ? b.first() : this.search_results.find(".active-result").first(),
            null != a ? this.result_do_highlight(a) : void 0
        }
        ,
        Chosen.prototype.no_results = function(b) {
            var c;
            return c = a('<li class="no-results">' + this.results_none_found + ' "<span></span>"</li>'),
            c.find("span").first().html(b),
            this.search_results.append(c),
            this.form_field_jq.trigger("chosen:no_results", {
                chosen: this
            })
        }
        ,
        Chosen.prototype.no_results_clear = function() {
            return this.search_results.find(".no-results").remove()
        }
        ,
        Chosen.prototype.keydown_arrow = function() {
            var a;
            return this.results_showing && this.result_highlight ? (a = this.result_highlight.nextAll("li.active-result").first()) ? this.result_do_highlight(a) : void 0 : this.results_show()
        }
        ,
        Chosen.prototype.keyup_arrow = function() {
            var a;
            return this.results_showing || this.is_multiple ? this.result_highlight ? (a = this.result_highlight.prevAll("li.active-result"),
            a.length ? this.result_do_highlight(a.first()) : (this.choices_count() > 0 && this.results_hide(),
            this.result_clear_highlight())) : void 0 : this.results_show()
        }
        ,
        Chosen.prototype.keydown_backstroke = function() {
            var a;
            return this.pending_backstroke ? (this.choice_destroy(this.pending_backstroke.find("a").first()),
            this.clear_backstroke()) : (a = this.search_container.siblings("li.search-choice").last(),
            a.length && !a.hasClass("search-choice-disabled") ? (this.pending_backstroke = a,
            this.single_backstroke_delete ? this.keydown_backstroke() : this.pending_backstroke.addClass("search-choice-focus")) : void 0)
        }
        ,
        Chosen.prototype.clear_backstroke = function() {
            return this.pending_backstroke && this.pending_backstroke.removeClass("search-choice-focus"),
            this.pending_backstroke = null
        }
        ,
        Chosen.prototype.keydown_checker = function(a) {
            var b, c;
            switch (b = null != (c = a.which) ? c : a.keyCode,
            this.search_field_scale(),
            8 !== b && this.pending_backstroke && this.clear_backstroke(),
            b) {
            case 8:
                this.backstroke_length = this.search_field.val().length;
                break;
            case 9:
                this.results_showing && !this.is_multiple && this.result_select(a),
                this.mouse_on_container = !1;
                break;
            case 13:
                a.preventDefault();
                break;
            case 38:
                a.preventDefault(),
                this.keyup_arrow();
                break;
            case 40:
                a.preventDefault(),
                this.keydown_arrow()
            }
        }
        ,
        Chosen.prototype.search_field_scale = function() {
            var b, c, d, e, f, g, h, i, j;
            if (this.is_multiple) {
                for (d = 0,
                h = 0,
                f = "position:absolute; left: -1000px; top: -1000px; display:none;",
                g = ["font-size", "font-style", "font-weight", "font-family", "line-height", "text-transform", "letter-spacing"],
                i = 0,
                j = g.length; j > i; i++)
                    e = g[i],
                    f += e + ":" + this.search_field.css(e) + ";";
                return b = a("<div />", {
                    style: f
                }),
                b.text(this.search_field.val()),
                a("body").append(b),
                h = b.width() + 25,
                b.remove(),
                c = this.container.outerWidth(),
                h > c - 10 && (h = c - 10),
                this.search_field.css({
                    width: h + "px"
                })
            }
        }
        ,
        Chosen
    }(AbstractChosen)
}
.call(this);
;!function(i) {
    var n = {};
    function o(t) {
        if (n[t])
            return n[t].exports;
        var e = n[t] = {
            i: t,
            l: !1,
            exports: {}
        };
        return i[t].call(e.exports, e, e.exports, o),
        e.l = !0,
        e.exports
    }
    o.m = i,
    o.c = n,
    o.d = function(t, e, i) {
        o.o(t, e) || Object.defineProperty(t, e, {
            enumerable: !0,
            get: i
        })
    }
    ,
    o.r = function(t) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
            value: "Module"
        }),
        Object.defineProperty(t, "__esModule", {
            value: !0
        })
    }
    ,
    o.t = function(e, t) {
        if (1 & t && (e = o(e)),
        8 & t)
            return e;
        if (4 & t && "object" == typeof e && e && e.__esModule)
            return e;
        var i = Object.create(null);
        if (o.r(i),
        Object.defineProperty(i, "default", {
            enumerable: !0,
            value: e
        }),
        2 & t && "string" != typeof e)
            for (var n in e)
                o.d(i, n, function(t) {
                    return e[t]
                }
                .bind(null, n));
        return i
    }
    ,
    o.n = function(t) {
        var e = t && t.__esModule ? function() {
            return t.default
        }
        : function() {
            return t
        }
        ;
        return o.d(e, "a", e),
        e
    }
    ,
    o.o = function(t, e) {
        return Object.prototype.hasOwnProperty.call(t, e)
    }
    ,
    o.p = "",
    o(o.s = 158)
}({
    158: function(t, e, i) {
        (function(Z) {
            var W = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                return typeof t
            }
            : function(t) {
                return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
            }
            ;
            !function(s, p, a) {
                var e, i, n, o, r, t = s.L, _ = {};
                function h(t) {
                    for (var e, i = ["webkit", "moz", "o", "ms"], n = 0; n < i.length && !e; n++)
                        e = s[i[n] + t];
                    return e
                }
                function l(t) {
                    var e = +new Date
                      , i = Math.max(0, 16 - (e - n));
                    return n = e + i,
                    s.setTimeout(t, i)
                }
                _.version = "0.7.3",
                "object" === W(Z) && "object" === W(Z.exports) && (Z.exports = _),
                _.noConflict = function() {
                    return s.L = t,
                    this
                }
                ,
                (s.L = _).Util = {
                    extend: function(t) {
                        for (var e, i, n = Array.prototype.slice.call(arguments, 1), o = 0, s = n.length; o < s; o++)
                            for (e in i = n[o] || {})
                                i.hasOwnProperty(e) && (t[e] = i[e]);
                        return t
                    },
                    bind: function(t, e) {
                        var i = 2 < arguments.length ? Array.prototype.slice.call(arguments, 2) : null;
                        return function() {
                            return t.apply(e, i || arguments)
                        }
                    },
                    stamp: (e = 0,
                    i = "_leaflet_id",
                    function(t) {
                        return t[i] = t[i] || ++e,
                        t[i]
                    }
                    ),
                    invokeEach: function(t, e, i) {
                        var n, o;
                        if ("object" !== (void 0 === t ? "undefined" : W(t)))
                            return !1;
                        for (n in o = Array.prototype.slice.call(arguments, 3),
                        t)
                            e.apply(i, [n, t[n]].concat(o));
                        return !0
                    },
                    limitExecByInterval: function(i, n, o) {
                        var s, a;
                        return function t() {
                            var e = arguments;
                            s ? a = !0 : (s = !0,
                            setTimeout(function() {
                                s = !1,
                                a && (t.apply(o, e),
                                a = !1)
                            }, n),
                            i.apply(o, e))
                        }
                    },
                    falseFn: function() {
                        return !1
                    },
                    formatNum: function(t, e) {
                        var i = Math.pow(10, e || 5);
                        return Math.round(t * i) / i
                    },
                    trim: function(t) {
                        return t.trim ? t.trim() : t.replace(/^\s+|\s+$/g, "")
                    },
                    splitWords: function(t) {
                        return _.Util.trim(t).split(/\s+/)
                    },
                    setOptions: function(t, e) {
                        return t.options = _.extend({}, t.options, e),
                        t.options
                    },
                    getParamString: function(t, e, i) {
                        var n = [];
                        for (var o in t)
                            n.push(encodeURIComponent(i ? o.toUpperCase() : o) + "=" + encodeURIComponent(t[o]));
                        return (e && -1 !== e.indexOf("?") ? "&" : "?") + n.join("&")
                    },
                    template: function(t, n) {
                        return t.replace(/\{ *([\w_]+) *\}/g, function(t, e) {
                            var i = n[e];
                            if (i === a)
                                throw new Error("No value provided for variable " + t);
                            return "function" == typeof i && (i = i(n)),
                            i
                        })
                    },
                    isArray: Array.isArray || function(t) {
                        return "[object Array]" === Object.prototype.toString.call(t)
                    }
                    ,
                    emptyImageUrl: "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
                },
                n = 0,
                o = s.requestAnimationFrame || h("RequestAnimationFrame") || l,
                r = s.cancelAnimationFrame || h("CancelAnimationFrame") || h("CancelRequestAnimationFrame") || function(t) {
                    s.clearTimeout(t)
                }
                ,
                _.Util.requestAnimFrame = function(t, e, i, n) {
                    if (t = _.bind(t, e),
                    !i || o !== l)
                        return o.call(s, t, n);
                    t()
                }
                ,
                _.Util.cancelAnimFrame = function(t) {
                    t && r.call(s, t)
                }
                ,
                _.extend = _.Util.extend,
                _.bind = _.Util.bind,
                _.stamp = _.Util.stamp,
                _.setOptions = _.Util.setOptions,
                _.Class = function() {}
                ,
                _.Class.extend = function(t) {
                    function e() {
                        this.initialize && this.initialize.apply(this, arguments),
                        this._initHooks && this.callInitHooks()
                    }
                    function i() {}
                    i.prototype = this.prototype;
                    var n = new i;
                    for (var o in (n.constructor = e).prototype = n,
                    this)
                        this.hasOwnProperty(o) && "prototype" !== o && (e[o] = this[o]);
                    t.statics && (_.extend(e, t.statics),
                    delete t.statics),
                    t.includes && (_.Util.extend.apply(null, [n].concat(t.includes)),
                    delete t.includes),
                    t.options && n.options && (t.options = _.extend({}, n.options, t.options)),
                    _.extend(n, t),
                    n._initHooks = [];
                    var s = this;
                    return e.__super__ = s.prototype,
                    n.callInitHooks = function() {
                        if (!this._initHooksCalled) {
                            s.prototype.callInitHooks && s.prototype.callInitHooks.call(this),
                            this._initHooksCalled = !0;
                            for (var t = 0, e = n._initHooks.length; t < e; t++)
                                n._initHooks[t].call(this)
                        }
                    }
                    ,
                    e
                }
                ,
                _.Class.include = function(t) {
                    _.extend(this.prototype, t)
                }
                ,
                _.Class.mergeOptions = function(t) {
                    _.extend(this.prototype.options, t)
                }
                ,
                _.Class.addInitHook = function(t) {
                    var e = Array.prototype.slice.call(arguments, 1)
                      , i = "function" == typeof t ? t : function() {
                        this[t].apply(this, e)
                    }
                    ;
                    this.prototype._initHooks = this.prototype._initHooks || [],
                    this.prototype._initHooks.push(i)
                }
                ;
                var u, c, d, m, f, g, v, y, P, L, x, b, w, T, D, E, M, C, S, k, B, O, U, A, I = "_leaflet_events";
                function z(t) {
                    return _.FeatureGroup.extend({
                        initialize: function(t, e) {
                            this._layers = {},
                            this._options = e,
                            this.setLatLngs(t)
                        },
                        setLatLngs: function(e) {
                            var i = 0
                              , n = e.length;
                            for (this.eachLayer(function(t) {
                                i < n ? t.setLatLngs(e[i++]) : this.removeLayer(t)
                            }, this); i < n; )
                                this.addLayer(new t(e[i++],this._options));
                            return this
                        },
                        getLatLngs: function() {
                            var e = [];
                            return this.eachLayer(function(t) {
                                e.push(t.getLatLngs())
                            }),
                            e
                        }
                    })
                }
                _.Mixin = {},
                _.Mixin.Events = {
                    addEventListener: function(t, e, i) {
                        if (_.Util.invokeEach(t, this.addEventListener, this, e, i))
                            return this;
                        for (var n, o, s, a, r, h = this[I] = this[I] || {}, l = i && i !== this && _.stamp(i), u = 0, c = (t = _.Util.splitWords(t)).length; u < c; u++)
                            n = {
                                action: e,
                                context: i || this
                            },
                            o = t[u],
                            l ? (a = (s = o + "_idx") + "_len",
                            (r = h[s] = h[s] || {})[l] || (r[l] = [],
                            h[a] = (h[a] || 0) + 1),
                            r[l].push(n)) : (h[o] = h[o] || [],
                            h[o].push(n));
                        return this
                    },
                    hasEventListeners: function(t) {
                        var e = this[I];
                        return !!e && (t in e && 0 < e[t].length || t + "_idx"in e && 0 < e[t + "_idx_len"])
                    },
                    removeEventListener: function(t, e, i) {
                        if (!this[I])
                            return this;
                        if (!t)
                            return this.clearAllEventListeners();
                        if (_.Util.invokeEach(t, this.removeEventListener, this, e, i))
                            return this;
                        for (var n, o, s, a, r, h, l = this[I], u = i && i !== this && _.stamp(i), c = 0, d = (t = _.Util.splitWords(t)).length; c < d; c++)
                            if (r = (a = (n = t[c]) + "_idx") + "_len",
                            h = l[a],
                            e) {
                                if (o = u && h ? h[u] : l[n]) {
                                    for (s = o.length - 1; 0 <= s; s--)
                                        o[s].action !== e || i && o[s].context !== i || (o.splice(s, 1)[0].action = _.Util.falseFn);
                                    i && h && 0 === o.length && (delete h[u],
                                    l[r]--)
                                }
                            } else
                                delete l[n],
                                delete l[a],
                                delete l[r];
                        return this
                    },
                    clearAllEventListeners: function() {
                        return delete this[I],
                        this
                    },
                    fireEvent: function(t, e) {
                        if (!this.hasEventListeners(t))
                            return this;
                        var i, n, o, s, a, r = _.Util.extend({}, e, {
                            type: t,
                            target: this
                        }), h = this[I];
                        if (h[t])
                            for (n = 0,
                            o = (i = h[t].slice()).length; n < o; n++)
                                i[n].action.call(i[n].context, r);
                        for (a in s = h[t + "_idx"])
                            if (i = s[a].slice())
                                for (n = 0,
                                o = i.length; n < o; n++)
                                    i[n].action.call(i[n].context, r);
                        return this
                    },
                    addOneTimeEventListener: function(t, e, i) {
                        if (_.Util.invokeEach(t, this.addOneTimeEventListener, this, e, i))
                            return this;
                        var n = _.bind(function() {
                            this.removeEventListener(t, e, i).removeEventListener(t, n, i)
                        }, this);
                        return this.addEventListener(t, e, i).addEventListener(t, n, i)
                    }
                },
                _.Mixin.Events.on = _.Mixin.Events.addEventListener,
                _.Mixin.Events.off = _.Mixin.Events.removeEventListener,
                _.Mixin.Events.once = _.Mixin.Events.addOneTimeEventListener,
                _.Mixin.Events.fire = _.Mixin.Events.fireEvent,
                c = (u = "ActiveXObject"in s) && !p.addEventListener,
                d = navigator.userAgent.toLowerCase(),
                m = -1 !== d.indexOf("webkit"),
                f = -1 !== d.indexOf("chrome"),
                g = -1 !== d.indexOf("phantom"),
                v = -1 !== d.indexOf("android"),
                y = -1 !== d.search("android [23]"),
                P = -1 !== d.indexOf("gecko"),
                L = ("undefined" == typeof orientation ? "undefined" : W(orientation)) !== a + "",
                x = s.navigator && s.navigator.msPointerEnabled && s.navigator.msMaxTouchPoints && !s.PointerEvent,
                b = s.PointerEvent && s.navigator.pointerEnabled && s.navigator.maxTouchPoints || x,
                w = "devicePixelRatio"in s && 1 < s.devicePixelRatio || "matchMedia"in s && s.matchMedia("(min-resolution:144dpi)") && s.matchMedia("(min-resolution:144dpi)").matches,
                T = p.documentElement,
                D = u && "transition"in T.style,
                E = "WebKitCSSMatrix"in s && "m11"in new s.WebKitCSSMatrix && !y,
                M = "MozPerspective"in T.style,
                C = "OTransition"in T.style,
                S = !s.L_DISABLE_3D && (D || E || M || C) && !g,
                k = !s.L_NO_TOUCH && !g && function() {
                    var t = "ontouchstart";
                    if (b || t in T)
                        return !0;
                    var e = p.createElement("div")
                      , i = !1;
                    return !!e.setAttribute && (e.setAttribute(t, "return;"),
                    "function" == typeof e[t] && (i = !0),
                    e.removeAttribute(t),
                    e = null,
                    i)
                }(),
                _.Browser = {
                    ie: u,
                    ielt9: c,
                    webkit: m,
                    gecko: P && !m && !s.opera && !u,
                    android: v,
                    android23: y,
                    chrome: f,
                    ie3d: D,
                    webkit3d: E,
                    gecko3d: M,
                    opera3d: C,
                    any3d: S,
                    mobile: L,
                    mobileWebkit: L && m,
                    mobileWebkit3d: L && E,
                    mobileOpera: L && s.opera,
                    touch: k,
                    msPointer: x,
                    pointer: b,
                    retina: w
                },
                _.Point = function(t, e, i) {
                    this.x = i ? Math.round(t) : t,
                    this.y = i ? Math.round(e) : e
                }
                ,
                _.Point.prototype = {
                    clone: function() {
                        return new _.Point(this.x,this.y)
                    },
                    add: function(t) {
                        return this.clone()._add(_.point(t))
                    },
                    _add: function(t) {
                        return this.x += t.x,
                        this.y += t.y,
                        this
                    },
                    subtract: function(t) {
                        return this.clone()._subtract(_.point(t))
                    },
                    _subtract: function(t) {
                        return this.x -= t.x,
                        this.y -= t.y,
                        this
                    },
                    divideBy: function(t) {
                        return this.clone()._divideBy(t)
                    },
                    _divideBy: function(t) {
                        return this.x /= t,
                        this.y /= t,
                        this
                    },
                    multiplyBy: function(t) {
                        return this.clone()._multiplyBy(t)
                    },
                    _multiplyBy: function(t) {
                        return this.x *= t,
                        this.y *= t,
                        this
                    },
                    round: function() {
                        return this.clone()._round()
                    },
                    _round: function() {
                        return this.x = Math.round(this.x),
                        this.y = Math.round(this.y),
                        this
                    },
                    floor: function() {
                        return this.clone()._floor()
                    },
                    _floor: function() {
                        return this.x = Math.floor(this.x),
                        this.y = Math.floor(this.y),
                        this
                    },
                    distanceTo: function(t) {
                        var e = (t = _.point(t)).x - this.x
                          , i = t.y - this.y;
                        return Math.sqrt(e * e + i * i)
                    },
                    equals: function(t) {
                        return (t = _.point(t)).x === this.x && t.y === this.y
                    },
                    contains: function(t) {
                        return t = _.point(t),
                        Math.abs(t.x) <= Math.abs(this.x) && Math.abs(t.y) <= Math.abs(this.y)
                    },
                    toString: function() {
                        return "Point(" + _.Util.formatNum(this.x) + ", " + _.Util.formatNum(this.y) + ")"
                    }
                },
                _.point = function(t, e, i) {
                    return t instanceof _.Point ? t : _.Util.isArray(t) ? new _.Point(t[0],t[1]) : t === a || null === t ? t : new _.Point(t,e,i)
                }
                ,
                _.Bounds = function(t, e) {
                    if (t)
                        for (var i = e ? [t, e] : t, n = 0, o = i.length; n < o; n++)
                            this.extend(i[n])
                }
                ,
                _.Bounds.prototype = {
                    extend: function(t) {
                        return t = _.point(t),
                        this.min || this.max ? (this.min.x = Math.min(t.x, this.min.x),
                        this.max.x = Math.max(t.x, this.max.x),
                        this.min.y = Math.min(t.y, this.min.y),
                        this.max.y = Math.max(t.y, this.max.y)) : (this.min = t.clone(),
                        this.max = t.clone()),
                        this
                    },
                    getCenter: function(t) {
                        return new _.Point((this.min.x + this.max.x) / 2,(this.min.y + this.max.y) / 2,t)
                    },
                    getBottomLeft: function() {
                        return new _.Point(this.min.x,this.max.y)
                    },
                    getTopRight: function() {
                        return new _.Point(this.max.x,this.min.y)
                    },
                    getSize: function() {
                        return this.max.subtract(this.min)
                    },
                    contains: function(t) {
                        var e, i;
                        return (t = "number" == typeof t[0] || t instanceof _.Point ? _.point(t) : _.bounds(t))instanceof _.Bounds ? (e = t.min,
                        i = t.max) : e = i = t,
                        e.x >= this.min.x && i.x <= this.max.x && e.y >= this.min.y && i.y <= this.max.y
                    },
                    intersects: function(t) {
                        t = _.bounds(t);
                        var e = this.min
                          , i = this.max
                          , n = t.min
                          , o = t.max
                          , s = o.x >= e.x && n.x <= i.x
                          , a = o.y >= e.y && n.y <= i.y;
                        return s && a
                    },
                    isValid: function() {
                        return !(!this.min || !this.max)
                    }
                },
                _.bounds = function(t, e) {
                    return !t || t instanceof _.Bounds ? t : new _.Bounds(t,e)
                }
                ,
                _.Transformation = function(t, e, i, n) {
                    this._a = t,
                    this._b = e,
                    this._c = i,
                    this._d = n
                }
                ,
                _.Transformation.prototype = {
                    transform: function(t, e) {
                        return this._transform(t.clone(), e)
                    },
                    _transform: function(t, e) {
                        return e = e || 1,
                        t.x = e * (this._a * t.x + this._b),
                        t.y = e * (this._c * t.y + this._d),
                        t
                    },
                    untransform: function(t, e) {
                        return e = e || 1,
                        new _.Point((t.x / e - this._b) / this._a,(t.y / e - this._d) / this._c)
                    }
                },
                _.DomUtil = {
                    get: function(t) {
                        return "string" == typeof t ? p.getElementById(t) : t
                    },
                    getStyle: function(t, e) {
                        var i, n = t.style[e];
                        return !n && t.currentStyle && (n = t.currentStyle[e]),
                        n && "auto" !== n || !p.defaultView || (n = (i = p.defaultView.getComputedStyle(t, null)) ? i[e] : null),
                        "auto" === n ? null : n
                    },
                    getViewportOffset: function(t) {
                        var e, i = 0, n = 0, o = t, s = p.body, a = p.documentElement;
                        do {
                            if (i += o.offsetTop || 0,
                            n += o.offsetLeft || 0,
                            i += parseInt(_.DomUtil.getStyle(o, "borderTopWidth"), 10) || 0,
                            n += parseInt(_.DomUtil.getStyle(o, "borderLeftWidth"), 10) || 0,
                            e = _.DomUtil.getStyle(o, "position"),
                            o.offsetParent === s && "absolute" === e)
                                break;
                            if ("fixed" === e) {
                                i += s.scrollTop || a.scrollTop || 0,
                                n += s.scrollLeft || a.scrollLeft || 0;
                                break
                            }
                            if ("relative" === e && !o.offsetLeft) {
                                var r = _.DomUtil.getStyle(o, "width")
                                  , h = _.DomUtil.getStyle(o, "max-width")
                                  , l = o.getBoundingClientRect();
                                "none" === r && "none" === h || (n += l.left + o.clientLeft),
                                i += l.top + (s.scrollTop || a.scrollTop || 0);
                                break
                            }
                            o = o.offsetParent
                        } while (o);o = t;
                        do {
                            if (o === s)
                                break;
                            i -= o.scrollTop || 0,
                            n -= o.scrollLeft || 0,
                            o = o.parentNode
                        } while (o);return new _.Point(n,i)
                    },
                    documentIsLtr: function() {
                        return _.DomUtil._docIsLtrCached || (_.DomUtil._docIsLtrCached = !0,
                        _.DomUtil._docIsLtr = "ltr" === _.DomUtil.getStyle(p.body, "direction")),
                        _.DomUtil._docIsLtr
                    },
                    create: function(t, e, i) {
                        var n = p.createElement(t);
                        return n.className = e,
                        i && i.appendChild(n),
                        n
                    },
                    hasClass: function(t, e) {
                        if (t.classList !== a)
                            return t.classList.contains(e);
                        var i = _.DomUtil._getClass(t);
                        return 0 < i.length && new RegExp("(^|\\s)" + e + "(\\s|$)").test(i)
                    },
                    addClass: function(t, e) {
                        var i;
                        if (t.classList !== a)
                            for (var n = _.Util.splitWords(e), o = 0, s = n.length; o < s; o++)
                                t.classList.add(n[o]);
                        else
                            _.DomUtil.hasClass(t, e) || (i = _.DomUtil._getClass(t),
                            _.DomUtil._setClass(t, (i ? i + " " : "") + e))
                    },
                    removeClass: function(t, e) {
                        t.classList !== a ? t.classList.remove(e) : _.DomUtil._setClass(t, _.Util.trim((" " + _.DomUtil._getClass(t) + " ").replace(" " + e + " ", " ")))
                    },
                    _setClass: function(t, e) {
                        t.className.baseVal === a ? t.className = e : t.className.baseVal = e
                    },
                    _getClass: function(t) {
                        return t.className.baseVal === a ? t.className : t.className.baseVal
                    },
                    setOpacity: function(t, e) {
                        if ("opacity"in t.style)
                            t.style.opacity = e;
                        else if ("filter"in t.style) {
                            var i = !1
                              , n = "DXImageTransform.Microsoft.Alpha";
                            try {
                                i = t.filters.item(n)
                            } catch (t) {
                                if (1 === e)
                                    return
                            }
                            e = Math.round(100 * e),
                            i ? (i.Enabled = 100 !== e,
                            i.Opacity = e) : t.style.filter += " progid:" + n + "(opacity=" + e + ")"
                        }
                    },
                    testProp: function(t) {
                        for (var e = p.documentElement.style, i = 0; i < t.length; i++)
                            if (t[i]in e)
                                return t[i];
                        return !1
                    },
                    getTranslateString: function(t) {
                        var e = _.Browser.webkit3d
                          , i = (e ? ",0" : "") + ")";
                        return "translate" + (e ? "3d" : "") + "(" + t.x + "px," + t.y + "px" + i
                    },
                    getScaleString: function(t, e) {
                        return _.DomUtil.getTranslateString(e.add(e.multiplyBy(-1 * t))) + (" scale(" + t + ") ")
                    },
                    setPosition: function(t, e, i) {
                        t._leaflet_pos = e,
                        !i && _.Browser.any3d ? t.style[_.DomUtil.TRANSFORM] = _.DomUtil.getTranslateString(e) : (t.style.left = e.x + "px",
                        t.style.top = e.y + "px")
                    },
                    getPosition: function(t) {
                        return t._leaflet_pos
                    }
                },
                _.DomUtil.TRANSFORM = _.DomUtil.testProp(["transform", "WebkitTransform", "OTransform", "MozTransform", "msTransform"]),
                _.DomUtil.TRANSITION = _.DomUtil.testProp(["webkitTransition", "transition", "OTransition", "MozTransition", "msTransition"]),
                _.DomUtil.TRANSITION_END = "webkitTransition" === _.DomUtil.TRANSITION || "OTransition" === _.DomUtil.TRANSITION ? _.DomUtil.TRANSITION + "End" : "transitionend",
                "onselectstart"in p ? _.extend(_.DomUtil, {
                    disableTextSelection: function() {
                        _.DomEvent.on(s, "selectstart", _.DomEvent.preventDefault)
                    },
                    enableTextSelection: function() {
                        _.DomEvent.off(s, "selectstart", _.DomEvent.preventDefault)
                    }
                }) : (B = _.DomUtil.testProp(["userSelect", "WebkitUserSelect", "OUserSelect", "MozUserSelect", "msUserSelect"]),
                _.extend(_.DomUtil, {
                    disableTextSelection: function() {
                        var t;
                        B && (t = p.documentElement.style,
                        this._userSelect = t[B],
                        t[B] = "none")
                    },
                    enableTextSelection: function() {
                        B && (p.documentElement.style[B] = this._userSelect,
                        delete this._userSelect)
                    }
                })),
                _.extend(_.DomUtil, {
                    disableImageDrag: function() {
                        _.DomEvent.on(s, "dragstart", _.DomEvent.preventDefault)
                    },
                    enableImageDrag: function() {
                        _.DomEvent.off(s, "dragstart", _.DomEvent.preventDefault)
                    }
                }),
                _.LatLng = function(t, e, i) {
                    if (t = parseFloat(t),
                    e = parseFloat(e),
                    isNaN(t) || isNaN(e))
                        throw new Error("Invalid LatLng object: (" + t + ", " + e + ")");
                    this.lat = t,
                    this.lng = e,
                    i !== a && (this.alt = parseFloat(i))
                }
                ,
                _.extend(_.LatLng, {
                    DEG_TO_RAD: Math.PI / 180,
                    RAD_TO_DEG: 180 / Math.PI,
                    MAX_MARGIN: 1e-9
                }),
                _.LatLng.prototype = {
                    equals: function(t) {
                        return !!t && (t = _.latLng(t),
                        Math.max(Math.abs(this.lat - t.lat), Math.abs(this.lng - t.lng)) <= _.LatLng.MAX_MARGIN)
                    },
                    toString: function(t) {
                        return "LatLng(" + _.Util.formatNum(this.lat, t) + ", " + _.Util.formatNum(this.lng, t) + ")"
                    },
                    distanceTo: function(t) {
                        t = _.latLng(t);
                        var e = _.LatLng.DEG_TO_RAD
                          , i = (t.lat - this.lat) * e
                          , n = (t.lng - this.lng) * e
                          , o = this.lat * e
                          , s = t.lat * e
                          , a = Math.sin(i / 2)
                          , r = Math.sin(n / 2)
                          , h = a * a + r * r * Math.cos(o) * Math.cos(s);
                        return 12756274 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h))
                    },
                    wrap: function(t, e) {
                        var i = ((i = this.lng) + (e = e || 180)) % (e - (t = t || -180)) + (i < t || i === e ? e : t);
                        return new _.LatLng(this.lat,i)
                    }
                },
                _.latLng = function(t, e) {
                    return t instanceof _.LatLng ? t : _.Util.isArray(t) ? "number" == typeof t[0] || "string" == typeof t[0] ? new _.LatLng(t[0],t[1],t[2]) : null : t === a || null === t ? t : "object" === (void 0 === t ? "undefined" : W(t)) && "lat"in t ? new _.LatLng(t.lat,"lng"in t ? t.lng : t.lon) : e === a ? null : new _.LatLng(t,e)
                }
                ,
                _.LatLngBounds = function(t, e) {
                    if (t)
                        for (var i = e ? [t, e] : t, n = 0, o = i.length; n < o; n++)
                            this.extend(i[n])
                }
                ,
                _.LatLngBounds.prototype = {
                    extend: function(t) {
                        if (!t)
                            return this;
                        var e = _.latLng(t);
                        return (t = null !== e ? e : _.latLngBounds(t))instanceof _.LatLng ? this._southWest || this._northEast ? (this._southWest.lat = Math.min(t.lat, this._southWest.lat),
                        this._southWest.lng = Math.min(t.lng, this._southWest.lng),
                        this._northEast.lat = Math.max(t.lat, this._northEast.lat),
                        this._northEast.lng = Math.max(t.lng, this._northEast.lng)) : (this._southWest = new _.LatLng(t.lat,t.lng),
                        this._northEast = new _.LatLng(t.lat,t.lng)) : t instanceof _.LatLngBounds && (this.extend(t._southWest),
                        this.extend(t._northEast)),
                        this
                    },
                    pad: function(t) {
                        var e = this._southWest
                          , i = this._northEast
                          , n = Math.abs(e.lat - i.lat) * t
                          , o = Math.abs(e.lng - i.lng) * t;
                        return new _.LatLngBounds(new _.LatLng(e.lat - n,e.lng - o),new _.LatLng(i.lat + n,i.lng + o))
                    },
                    getCenter: function() {
                        return new _.LatLng((this._southWest.lat + this._northEast.lat) / 2,(this._southWest.lng + this._northEast.lng) / 2)
                    },
                    getSouthWest: function() {
                        return this._southWest
                    },
                    getNorthEast: function() {
                        return this._northEast
                    },
                    getNorthWest: function() {
                        return new _.LatLng(this.getNorth(),this.getWest())
                    },
                    getSouthEast: function() {
                        return new _.LatLng(this.getSouth(),this.getEast())
                    },
                    getWest: function() {
                        return this._southWest.lng
                    },
                    getSouth: function() {
                        return this._southWest.lat
                    },
                    getEast: function() {
                        return this._northEast.lng
                    },
                    getNorth: function() {
                        return this._northEast.lat
                    },
                    contains: function(t) {
                        t = "number" == typeof t[0] || t instanceof _.LatLng ? _.latLng(t) : _.latLngBounds(t);
                        var e, i, n = this._southWest, o = this._northEast;
                        return t instanceof _.LatLngBounds ? (e = t.getSouthWest(),
                        i = t.getNorthEast()) : e = i = t,
                        e.lat >= n.lat && i.lat <= o.lat && e.lng >= n.lng && i.lng <= o.lng
                    },
                    intersects: function(t) {
                        t = _.latLngBounds(t);
                        var e = this._southWest
                          , i = this._northEast
                          , n = t.getSouthWest()
                          , o = t.getNorthEast()
                          , s = o.lat >= e.lat && n.lat <= i.lat
                          , a = o.lng >= e.lng && n.lng <= i.lng;
                        return s && a
                    },
                    toBBoxString: function() {
                        return [this.getWest(), this.getSouth(), this.getEast(), this.getNorth()].join(",")
                    },
                    equals: function(t) {
                        return !!t && (t = _.latLngBounds(t),
                        this._southWest.equals(t.getSouthWest()) && this._northEast.equals(t.getNorthEast()))
                    },
                    isValid: function() {
                        return !(!this._southWest || !this._northEast)
                    }
                },
                _.latLngBounds = function(t, e) {
                    return !t || t instanceof _.LatLngBounds ? t : new _.LatLngBounds(t,e)
                }
                ,
                _.Projection = {},
                _.Projection.SphericalMercator = {
                    MAX_LATITUDE: 85.0511287798,
                    project: function(t) {
                        var e = _.LatLng.DEG_TO_RAD
                          , i = this.MAX_LATITUDE
                          , n = Math.max(Math.min(i, t.lat), -i)
                          , o = t.lng * e
                          , s = n * e
                          , s = Math.log(Math.tan(Math.PI / 4 + s / 2));
                        return new _.Point(o,s)
                    },
                    unproject: function(t) {
                        var e = _.LatLng.RAD_TO_DEG
                          , i = t.x * e
                          , n = (2 * Math.atan(Math.exp(t.y)) - Math.PI / 2) * e;
                        return new _.LatLng(n,i)
                    }
                },
                _.Projection.LonLat = {
                    project: function(t) {
                        return new _.Point(t.lng,t.lat)
                    },
                    unproject: function(t) {
                        return new _.LatLng(t.y,t.x)
                    }
                },
                _.CRS = {
                    latLngToPoint: function(t, e) {
                        var i = this.projection.project(t)
                          , n = this.scale(e);
                        return this.transformation._transform(i, n)
                    },
                    pointToLatLng: function(t, e) {
                        var i = this.scale(e)
                          , n = this.transformation.untransform(t, i);
                        return this.projection.unproject(n)
                    },
                    project: function(t) {
                        return this.projection.project(t)
                    },
                    scale: function(t) {
                        return 256 * Math.pow(2, t)
                    },
                    getSize: function(t) {
                        var e = this.scale(t);
                        return _.point(e, e)
                    }
                },
                _.CRS.Simple = _.extend({}, _.CRS, {
                    projection: _.Projection.LonLat,
                    transformation: new _.Transformation(1,0,-1,0),
                    scale: function(t) {
                        return Math.pow(2, t)
                    }
                }),
                _.CRS.EPSG3857 = _.extend({}, _.CRS, {
                    code: "EPSG:3857",
                    projection: _.Projection.SphericalMercator,
                    transformation: new _.Transformation(.5 / Math.PI,.5,-.5 / Math.PI,.5),
                    project: function(t) {
                        return this.projection.project(t).multiplyBy(6378137)
                    }
                }),
                _.CRS.EPSG900913 = _.extend({}, _.CRS.EPSG3857, {
                    code: "EPSG:900913"
                }),
                _.CRS.EPSG4326 = _.extend({}, _.CRS, {
                    code: "EPSG:4326",
                    projection: _.Projection.LonLat,
                    transformation: new _.Transformation(1 / 360,.5,-1 / 360,.5)
                }),
                _.Map = _.Class.extend({
                    includes: _.Mixin.Events,
                    options: {
                        crs: _.CRS.EPSG3857,
                        fadeAnimation: _.DomUtil.TRANSITION && !_.Browser.android23,
                        trackResize: !0,
                        markerZoomAnimation: _.DomUtil.TRANSITION && _.Browser.any3d
                    },
                    initialize: function(t, e) {
                        e = _.setOptions(this, e),
                        this._initContainer(t),
                        this._initLayout(),
                        this._onResize = _.bind(this._onResize, this),
                        this._initEvents(),
                        e.maxBounds && this.setMaxBounds(e.maxBounds),
                        e.center && e.zoom !== a && this.setView(_.latLng(e.center), e.zoom, {
                            reset: !0
                        }),
                        this._handlers = [],
                        this._layers = {},
                        this._zoomBoundLayers = {},
                        this._tileLayersNum = 0,
                        this.callInitHooks(),
                        this._addLayers(e.layers)
                    },
                    setView: function(t, e) {
                        return e = e === a ? this.getZoom() : e,
                        this._resetView(_.latLng(t), this._limitZoom(e)),
                        this
                    },
                    setZoom: function(t, e) {
                        return this._loaded ? this.setView(this.getCenter(), t, {
                            zoom: e
                        }) : (this._zoom = this._limitZoom(t),
                        this)
                    },
                    zoomIn: function(t, e) {
                        return this.setZoom(this._zoom + (t || 1), e)
                    },
                    zoomOut: function(t, e) {
                        return this.setZoom(this._zoom - (t || 1), e)
                    },
                    setZoomAround: function(t, e, i) {
                        var n = this.getZoomScale(e)
                          , o = this.getSize().divideBy(2)
                          , s = (t instanceof _.Point ? t : this.latLngToContainerPoint(t)).subtract(o).multiplyBy(1 - 1 / n)
                          , a = this.containerPointToLatLng(o.add(s));
                        return this.setView(a, e, {
                            zoom: i
                        })
                    },
                    fitBounds: function(t, e) {
                        e = e || {},
                        t = t.getBounds ? t.getBounds() : _.latLngBounds(t);
                        var i = _.point(e.paddingTopLeft || e.padding || [0, 0])
                          , n = _.point(e.paddingBottomRight || e.padding || [0, 0])
                          , o = this.getBoundsZoom(t, !1, i.add(n))
                          , s = n.subtract(i).divideBy(2)
                          , a = this.project(t.getSouthWest(), o)
                          , r = this.project(t.getNorthEast(), o)
                          , h = this.unproject(a.add(r).divideBy(2).add(s), o)
                          , o = e && e.maxZoom ? Math.min(e.maxZoom, o) : o;
                        return this.setView(h, o, e)
                    },
                    fitBoundsCustom: function(t, e) {
                        e = e || {},
                        t = t.getBounds ? t.getBounds() : _.latLngBounds(t);
                        var i = _.point(e.paddingTopLeft || e.padding || [0, 0])
                          , n = _.point(e.paddingBottomRight || e.padding || [0, 0])
                          , o = this.getBoundsZoom(t, !1, i.add(n))
                          , s = n.subtract(i).divideBy(2)
                          , a = this.project(t.getSouthWest(), o)
                          , r = this.project(t.getNorthEast(), o)
                          , h = this.unproject(a.add(r).divideBy(2).add(s), o);
                        return (o = e && e.maxZoom ? Math.min(e.maxZoom, o) : o) < 11 && (o = 11),
                        this.setView(h, o, e)
                    },
                    fitWorld: function(t) {
                        return this.fitBounds([[-90, -180], [90, 180]], t)
                    },
                    panTo: function(t, e) {
                        return this.setView(t, this._zoom, {
                            pan: e
                        })
                    },
                    panBy: function(t) {
                        return this.fire("movestart"),
                        this._rawPanBy(_.point(t)),
                        this.fire("move"),
                        this.fire("moveend")
                    },
                    setMaxBounds: function(t) {
                        return t = _.latLngBounds(t),
                        (this.options.maxBounds = t) ? (this._loaded && this._panInsideMaxBounds(),
                        this.on("moveend", this._panInsideMaxBounds, this)) : this.off("moveend", this._panInsideMaxBounds, this)
                    },
                    panInsideBounds: function(t, e) {
                        var i = this.getCenter()
                          , n = this._limitCenter(i, this._zoom, t);
                        return i.equals(n) ? this : this.panTo(n, e)
                    },
                    addLayer: function(t) {
                        var e = _.stamp(t);
                        return this._layers[e] || (!(this._layers[e] = t).options || isNaN(t.options.maxZoom) && isNaN(t.options.minZoom) || (this._zoomBoundLayers[e] = t,
                        this._updateZoomLevels()),
                        this.options.zoomAnimation && _.TileLayer && t instanceof _.TileLayer && (this._tileLayersNum++,
                        this._tileLayersToLoad++,
                        t.on("load", this._onTileLayerLoad, this)),
                        this._loaded && this._layerAdd(t)),
                        this
                    },
                    removeLayer: function(t) {
                        var e = _.stamp(t);
                        return this._layers[e] && (this._loaded && t.onRemove(this),
                        delete this._layers[e],
                        this._loaded && this.fire("layerremove", {
                            layer: t
                        }),
                        this._zoomBoundLayers[e] && (delete this._zoomBoundLayers[e],
                        this._updateZoomLevels()),
                        this.options.zoomAnimation && _.TileLayer && t instanceof _.TileLayer && (this._tileLayersNum--,
                        this._tileLayersToLoad--,
                        t.off("load", this._onTileLayerLoad, this))),
                        this
                    },
                    hasLayer: function(t) {
                        return !!t && _.stamp(t)in this._layers
                    },
                    eachLayer: function(t, e) {
                        for (var i in this._layers)
                            t.call(e, this._layers[i]);
                        return this
                    },
                    invalidateSize: function(t) {
                        if (!this._loaded)
                            return this;
                        t = _.extend({
                            animate: !1,
                            pan: !0
                        }, !0 === t ? {
                            animate: !0
                        } : t);
                        var e = this.getSize();
                        this._sizeChanged = !0,
                        this._initialCenter = null;
                        var i = this.getSize()
                          , n = e.divideBy(2).round()
                          , o = i.divideBy(2).round()
                          , s = n.subtract(o);
                        return s.x || s.y ? (t.animate && t.pan ? this.panBy(s) : (t.pan && this._rawPanBy(s),
                        this.fire("move"),
                        t.debounceMoveend ? (clearTimeout(this._sizeTimer),
                        this._sizeTimer = setTimeout(_.bind(this.fire, this, "moveend"), 200)) : this.fire("moveend")),
                        this.fire("resize", {
                            oldSize: e,
                            newSize: i
                        })) : this
                    },
                    addHandler: function(t, e) {
                        if (!e)
                            return this;
                        var i = this[t] = new e(this);
                        return this._handlers.push(i),
                        this.options[t] && i.enable(),
                        this
                    },
                    remove: function() {
                        this._loaded && this.fire("unload"),
                        this._initEvents("off");
                        try {
                            delete this._container._leaflet
                        } catch (t) {
                            this._container._leaflet = a
                        }
                        return this._clearPanes(),
                        this._clearControlPos && this._clearControlPos(),
                        this._clearHandlers(),
                        this
                    },
                    getCenter: function() {
                        return this._checkIfLoaded(),
                        this._initialCenter && !this._moved() ? this._initialCenter : this.layerPointToLatLng(this._getCenterLayerPoint())
                    },
                    getZoom: function() {
                        return this._zoom
                    },
                    getBounds: function() {
                        var t = this.getPixelBounds()
                          , e = this.unproject(t.getBottomLeft())
                          , i = this.unproject(t.getTopRight());
                        return new _.LatLngBounds(e,i)
                    },
                    getMinZoom: function() {
                        return this.options.minZoom === a ? this._layersMinZoom === a ? 0 : this._layersMinZoom : this.options.minZoom
                    },
                    getMaxZoom: function() {
                        return this.options.maxZoom === a ? this._layersMaxZoom === a ? 1 / 0 : this._layersMaxZoom : this.options.maxZoom
                    },
                    getBoundsZoom: function(t, e, i) {
                        t = _.latLngBounds(t);
                        var n, o = this.getMinZoom() - (e ? 1 : 0), s = this.getMaxZoom(), a = this.getSize(), r = t.getNorthWest(), h = t.getSouthEast(), l = !0;
                        for (i = _.point(i || [0, 0]); o++,
                        n = this.project(h, o).subtract(this.project(r, o)).add(i),
                        (l = e ? n.x < a.x || n.y < a.y : a.contains(n)) && o <= s; )
                            ;
                        return l && e ? null : e ? o : o - 1
                    },
                    getSize: function() {
                        return this._size && !this._sizeChanged || (this._size = new _.Point(this._container.clientWidth,this._container.clientHeight),
                        this._sizeChanged = !1),
                        this._size.clone()
                    },
                    getPixelBounds: function() {
                        var t = this._getTopLeftPoint();
                        return new _.Bounds(t,t.add(this.getSize()))
                    },
                    getPixelOrigin: function() {
                        return this._checkIfLoaded(),
                        this._initialTopLeftPoint
                    },
                    getPanes: function() {
                        return this._panes
                    },
                    getContainer: function() {
                        return this._container
                    },
                    getZoomScale: function(t) {
                        var e = this.options.crs;
                        return e.scale(t) / e.scale(this._zoom)
                    },
                    getScaleZoom: function(t) {
                        return this._zoom + Math.log(t) / Math.LN2
                    },
                    project: function(t, e) {
                        return e = e === a ? this._zoom : e,
                        this.options.crs.latLngToPoint(_.latLng(t), e)
                    },
                    unproject: function(t, e) {
                        return e = e === a ? this._zoom : e,
                        this.options.crs.pointToLatLng(_.point(t), e)
                    },
                    layerPointToLatLng: function(t) {
                        var e = _.point(t).add(this.getPixelOrigin());
                        return this.unproject(e)
                    },
                    latLngToLayerPoint: function(t) {
                        return this.project(_.latLng(t))._round()._subtract(this.getPixelOrigin())
                    },
                    containerPointToLayerPoint: function(t) {
                        return _.point(t).subtract(this._getMapPanePos())
                    },
                    layerPointToContainerPoint: function(t) {
                        return _.point(t).add(this._getMapPanePos())
                    },
                    containerPointToLatLng: function(t) {
                        var e = this.containerPointToLayerPoint(_.point(t));
                        return this.layerPointToLatLng(e)
                    },
                    latLngToContainerPoint: function(t) {
                        return this.layerPointToContainerPoint(this.latLngToLayerPoint(_.latLng(t)))
                    },
                    mouseEventToContainerPoint: function(t) {
                        return _.DomEvent.getMousePosition(t, this._container)
                    },
                    mouseEventToLayerPoint: function(t) {
                        return this.containerPointToLayerPoint(this.mouseEventToContainerPoint(t))
                    },
                    mouseEventToLatLng: function(t) {
                        return this.layerPointToLatLng(this.mouseEventToLayerPoint(t))
                    },
                    _initContainer: function(t) {
                        var e = this._container = _.DomUtil.get(t);
                        if (!e)
                            throw new Error("Map container not found.");
                        if (e._leaflet)
                            throw new Error("Map container is already initialized.");
                        e._leaflet = !0
                    },
                    _initLayout: function() {
                        var t = this._container;
                        _.DomUtil.addClass(t, "leaflet-container" + (_.Browser.touch ? " leaflet-touch" : "") + (_.Browser.retina ? " leaflet-retina" : "") + (_.Browser.ielt9 ? " leaflet-oldie" : "") + (this.options.fadeAnimation ? " leaflet-fade-anim" : ""));
                        var e = _.DomUtil.getStyle(t, "position");
                        "absolute" !== e && "relative" !== e && "fixed" !== e && (t.style.position = "relative"),
                        this._initPanes(),
                        this._initControlPos && this._initControlPos()
                    },
                    _initPanes: function() {
                        var t = this._panes = {};
                        this._mapPane = t.mapPane = this._createPane("leaflet-map-pane", this._container),
                        this._tilePane = t.tilePane = this._createPane("leaflet-tile-pane", this._mapPane),
                        t.objectsPane = this._createPane("leaflet-objects-pane", this._mapPane),
                        t.shadowPane = this._createPane("leaflet-shadow-pane"),
                        t.overlayPane = this._createPane("leaflet-overlay-pane"),
                        t.markerPane = this._createPane("leaflet-marker-pane"),
                        t.popupPane = this._createPane("leaflet-popup-pane");
                        var e = " leaflet-zoom-hide";
                        this.options.markerZoomAnimation || (_.DomUtil.addClass(t.markerPane, e),
                        _.DomUtil.addClass(t.shadowPane, e),
                        _.DomUtil.addClass(t.popupPane, e))
                    },
                    _createPane: function(t, e) {
                        return _.DomUtil.create("div", t, e || this._panes.objectsPane)
                    },
                    _clearPanes: function() {
                        this._container.removeChild(this._mapPane)
                    },
                    _addLayers: function(t) {
                        for (var e = 0, i = (t = t ? _.Util.isArray(t) ? t : [t] : []).length; e < i; e++)
                            this.addLayer(t[e])
                    },
                    _resetView: function(t, e, i, n) {
                        var o = this._zoom !== e;
                        n || (this.fire("movestart"),
                        o && this.fire("zoomstart")),
                        this._zoom = e,
                        this._initialCenter = t,
                        this._initialTopLeftPoint = this._getNewTopLeftPoint(t),
                        i ? this._initialTopLeftPoint._add(this._getMapPanePos()) : _.DomUtil.setPosition(this._mapPane, new _.Point(0,0)),
                        this._tileLayersToLoad = this._tileLayersNum;
                        var s = !this._loaded;
                        this._loaded = !0,
                        this.fire("viewreset", {
                            hard: !i
                        }),
                        s && (this.fire("load"),
                        this.eachLayer(this._layerAdd, this)),
                        this.fire("move"),
                        (o || n) && this.fire("zoomend"),
                        this.fire("moveend", {
                            hard: !i
                        })
                    },
                    _rawPanBy: function(t) {
                        _.DomUtil.setPosition(this._mapPane, this._getMapPanePos().subtract(t))
                    },
                    _getZoomSpan: function() {
                        return this.getMaxZoom() - this.getMinZoom()
                    },
                    _updateZoomLevels: function() {
                        var t, e = 1 / 0, i = -1 / 0, n = this._getZoomSpan();
                        for (t in this._zoomBoundLayers) {
                            var o = this._zoomBoundLayers[t];
                            isNaN(o.options.minZoom) || (e = Math.min(e, o.options.minZoom)),
                            isNaN(o.options.maxZoom) || (i = Math.max(i, o.options.maxZoom))
                        }
                        t === a ? this._layersMaxZoom = this._layersMinZoom = a : (this._layersMaxZoom = i,
                        this._layersMinZoom = e),
                        n !== this._getZoomSpan() && this.fire("zoomlevelschange")
                    },
                    _panInsideMaxBounds: function() {
                        this.panInsideBounds(this.options.maxBounds)
                    },
                    _checkIfLoaded: function() {
                        if (!this._loaded)
                            throw new Error("Set map center and zoom first.")
                    },
                    _initEvents: function(t) {
                        if (_.DomEvent) {
                            t = t || "on",
                            _.DomEvent[t](this._container, "click", this._onMouseClick, this);
                            for (var e = ["dblclick", "mousedown", "mouseup", "mouseenter", "mouseleave", "mousemove", "contextmenu"], i = 0, n = e.length; i < n; i++)
                                _.DomEvent[t](this._container, e[i], this._fireMouseEvent, this);
                            this.options.trackResize && _.DomEvent[t](s, "resize", this._onResize, this)
                        }
                    },
                    _onResize: function() {
                        _.Util.cancelAnimFrame(this._resizeRequest),
                        this._resizeRequest = _.Util.requestAnimFrame(function() {
                            this.invalidateSize({
                                debounceMoveend: !0
                            })
                        }, this, !1, this._container)
                    },
                    _onMouseClick: function(t) {
                        !this._loaded || !t._simulated && (this.dragging && this.dragging.moved() || this.boxZoom && this.boxZoom.moved()) || _.DomEvent._skipped(t) || (this.fire("preclick"),
                        this._fireMouseEvent(t))
                    },
                    _fireMouseEvent: function(t) {
                        var e, i, n, o;
                        this._loaded && !_.DomEvent._skipped(t) && (o = "mouseenter" === (o = t.type) ? "mouseover" : "mouseleave" === o ? "mouseout" : o,
                        this.hasEventListeners(o) && ("contextmenu" === o && _.DomEvent.preventDefault(t),
                        e = this.mouseEventToContainerPoint(t),
                        i = this.containerPointToLayerPoint(e),
                        n = this.layerPointToLatLng(i),
                        this.fire(o, {
                            latlng: n,
                            layerPoint: i,
                            containerPoint: e,
                            originalEvent: t
                        })))
                    },
                    _onTileLayerLoad: function() {
                        this._tileLayersToLoad--,
                        this._tileLayersNum && !this._tileLayersToLoad && this.fire("tilelayersload")
                    },
                    _clearHandlers: function() {
                        for (var t = 0, e = this._handlers.length; t < e; t++)
                            this._handlers[t].disable()
                    },
                    whenReady: function(t, e) {
                        return this._loaded ? t.call(e || this, this) : this.on("load", t, e),
                        this
                    },
                    _layerAdd: function(t) {
                        t.onAdd(this),
                        this.fire("layeradd", {
                            layer: t
                        })
                    },
                    _getMapPanePos: function() {
                        return _.DomUtil.getPosition(this._mapPane)
                    },
                    _moved: function() {
                        var t = this._getMapPanePos();
                        return t && !t.equals([0, 0])
                    },
                    _getTopLeftPoint: function() {
                        return this.getPixelOrigin().subtract(this._getMapPanePos())
                    },
                    _getNewTopLeftPoint: function(t, e) {
                        var i = this.getSize()._divideBy(2);
                        return this.project(t, e)._subtract(i)._round()
                    },
                    _latLngToNewLayerPoint: function(t, e, i) {
                        var n = this._getNewTopLeftPoint(i, e).add(this._getMapPanePos());
                        return this.project(t, e)._subtract(n)
                    },
                    _getCenterLayerPoint: function() {
                        return this.containerPointToLayerPoint(this.getSize()._divideBy(2))
                    },
                    _getCenterOffset: function(t) {
                        return this.latLngToLayerPoint(t).subtract(this._getCenterLayerPoint())
                    },
                    _limitCenter: function(t, e, i) {
                        if (!i)
                            return t;
                        var n = this.project(t, e)
                          , o = this.getSize().divideBy(2)
                          , s = new _.Bounds(n.subtract(o),n.add(o))
                          , a = this._getBoundsOffset(s, i, e);
                        return this.unproject(n.add(a), e)
                    },
                    _limitOffset: function(t, e) {
                        if (!e)
                            return t;
                        var i = this.getPixelBounds()
                          , n = new _.Bounds(i.min.add(t),i.max.add(t));
                        return t.add(this._getBoundsOffset(n, e))
                    },
                    _getBoundsOffset: function(t, e, i) {
                        var n = this.project(e.getNorthWest(), i).subtract(t.min)
                          , o = this.project(e.getSouthEast(), i).subtract(t.max)
                          , s = this._rebound(n.x, -o.x)
                          , a = this._rebound(n.y, -o.y);
                        return new _.Point(s,a)
                    },
                    _rebound: function(t, e) {
                        return 0 < t + e ? Math.round(t - e) / 2 : Math.max(0, Math.ceil(t)) - Math.max(0, Math.floor(e))
                    },
                    _limitZoom: function(t) {
                        var e = this.getMinZoom()
                          , i = this.getMaxZoom();
                        return Math.max(e, Math.min(i, t))
                    }
                }),
                _.map = function(t, e) {
                    return new _.Map(t,e)
                }
                ,
                _.Projection.Mercator = {
                    MAX_LATITUDE: 85.0840591556,
                    R_MINOR: 6356752.314245179,
                    R_MAJOR: 6378137,
                    project: function(t) {
                        var e = _.LatLng.DEG_TO_RAD
                          , i = this.MAX_LATITUDE
                          , n = Math.max(Math.min(i, t.lat), -i)
                          , o = this.R_MAJOR
                          , s = this.R_MINOR
                          , a = t.lng * e * o
                          , r = n * e
                          , h = s / o
                          , l = Math.sqrt(1 - h * h)
                          , u = l * Math.sin(r)
                          , u = Math.pow((1 - u) / (1 + u), .5 * l)
                          , c = Math.tan(.5 * (.5 * Math.PI - r)) / u
                          , r = -o * Math.log(c);
                        return new _.Point(a,r)
                    },
                    unproject: function(t) {
                        for (var e, i = _.LatLng.RAD_TO_DEG, n = this.R_MAJOR, o = this.R_MINOR, s = t.x * i / n, a = o / n, r = Math.sqrt(1 - a * a), h = Math.exp(-t.y / n), l = Math.PI / 2 - 2 * Math.atan(h), u = 15, c = .1; 1e-7 < Math.abs(c) && 0 < --u; )
                            e = r * Math.sin(l),
                            l += c = Math.PI / 2 - 2 * Math.atan(h * Math.pow((1 - e) / (1 + e), .5 * r)) - l;
                        return new _.LatLng(l * i,s)
                    }
                },
                _.CRS.EPSG3395 = _.extend({}, _.CRS, {
                    code: "EPSG:3395",
                    projection: _.Projection.Mercator,
                    transformation: (O = _.Projection.Mercator.R_MAJOR,
                    U = .5 / (Math.PI * O),
                    new _.Transformation(U,.5,-U,.5))
                }),
                _.TileLayer = _.Class.extend({
                    includes: _.Mixin.Events,
                    options: {
                        minZoom: 0,
                        maxZoom: 18,
                        tileSize: 256,
                        subdomains: "abc",
                        errorTileUrl: "",
                        attribution: "",
                        zoomOffset: 0,
                        opacity: 1,
                        unloadInvisibleTiles: _.Browser.mobile,
                        updateWhenIdle: _.Browser.mobile
                    },
                    initialize: function(t, e) {
                        (e = _.setOptions(this, e)).detectRetina && _.Browser.retina && 0 < e.maxZoom && (e.tileSize = Math.floor(e.tileSize / 2),
                        e.zoomOffset++,
                        0 < e.minZoom && e.minZoom--,
                        this.options.maxZoom--),
                        e.bounds && (e.bounds = _.latLngBounds(e.bounds)),
                        this._url = t;
                        var i = this.options.subdomains;
                        "string" == typeof i && (this.options.subdomains = i.split(""))
                    },
                    onAdd: function(t) {
                        this._map = t,
                        this._animated = t._zoomAnimated,
                        this._initContainer(),
                        t.on({
                            viewreset: this._reset,
                            moveend: this._update
                        }, this),
                        this._animated && t.on({
                            zoomanim: this._animateZoom,
                            zoomend: this._endZoomAnim
                        }, this),
                        this.options.updateWhenIdle || (this._limitedUpdate = _.Util.limitExecByInterval(this._update, 150, this),
                        t.on("move", this._limitedUpdate, this)),
                        this._reset(),
                        this._update()
                    },
                    addTo: function(t) {
                        return t.addLayer(this),
                        this
                    },
                    onRemove: function(t) {
                        this._container.parentNode.removeChild(this._container),
                        t.off({
                            viewreset: this._reset,
                            moveend: this._update
                        }, this),
                        this._animated && t.off({
                            zoomanim: this._animateZoom,
                            zoomend: this._endZoomAnim
                        }, this),
                        this.options.updateWhenIdle || t.off("move", this._limitedUpdate, this),
                        this._container = null,
                        this._map = null
                    },
                    bringToFront: function() {
                        var t = this._map._panes.tilePane;
                        return this._container && (t.appendChild(this._container),
                        this._setAutoZIndex(t, Math.max)),
                        this
                    },
                    bringToBack: function() {
                        var t = this._map._panes.tilePane;
                        return this._container && (t.insertBefore(this._container, t.firstChild),
                        this._setAutoZIndex(t, Math.min)),
                        this
                    },
                    getAttribution: function() {
                        return this.options.attribution
                    },
                    getContainer: function() {
                        return this._container
                    },
                    setOpacity: function(t) {
                        return this.options.opacity = t,
                        this._map && this._updateOpacity(),
                        this
                    },
                    setZIndex: function(t) {
                        return this.options.zIndex = t,
                        this._updateZIndex(),
                        this
                    },
                    setUrl: function(t, e) {
                        return this._url = t,
                        e || this.redraw(),
                        this
                    },
                    redraw: function() {
                        return this._map && (this._reset({
                            hard: !0
                        }),
                        this._update()),
                        this
                    },
                    _updateZIndex: function() {
                        this._container && this.options.zIndex !== a && (this._container.style.zIndex = this.options.zIndex)
                    },
                    _setAutoZIndex: function(t, e) {
                        for (var i, n = t.children, o = -e(1 / 0, -1 / 0), s = 0, a = n.length; s < a; s++)
                            n[s] !== this._container && (i = parseInt(n[s].style.zIndex, 10),
                            isNaN(i) || (o = e(o, i)));
                        this.options.zIndex = this._container.style.zIndex = (isFinite(o) ? o : 0) + e(1, -1)
                    },
                    _updateOpacity: function() {
                        var t, e = this._tiles;
                        if (_.Browser.ielt9)
                            for (t in e)
                                _.DomUtil.setOpacity(e[t], this.options.opacity);
                        else
                            _.DomUtil.setOpacity(this._container, this.options.opacity)
                    },
                    _initContainer: function() {
                        var t, e = this._map._panes.tilePane;
                        this._container || (this._container = _.DomUtil.create("div", "leaflet-layer"),
                        this._updateZIndex(),
                        this._animated ? (t = "leaflet-tile-container",
                        this._bgBuffer = _.DomUtil.create("div", t, this._container),
                        this._tileContainer = _.DomUtil.create("div", t, this._container)) : this._tileContainer = this._container,
                        e.appendChild(this._container),
                        this.options.opacity < 1 && this._updateOpacity())
                    },
                    _reset: function(t) {
                        for (var e in this._tiles)
                            this.fire("tileunload", {
                                tile: this._tiles[e]
                            });
                        this._tiles = {},
                        this._tilesToLoad = 0,
                        this.options.reuseTiles && (this._unusedTiles = []),
                        this._tileContainer.innerHTML = "",
                        this._animated && t && t.hard && this._clearBgBuffer(),
                        this._initContainer()
                    },
                    _getTileSize: function() {
                        var t = this._map
                          , e = t.getZoom() + this.options.zoomOffset
                          , i = this.options.maxNativeZoom
                          , n = this.options.tileSize;
                        return i && i < e && (n = Math.round(t.getZoomScale(e) / t.getZoomScale(i) * n)),
                        n
                    },
                    _update: function() {
                        var t, e, i, n, o;
                        this._map && (e = (t = this._map).getPixelBounds(),
                        i = t.getZoom(),
                        n = this._getTileSize(),
                        i > this.options.maxZoom || i < this.options.minZoom || (o = _.bounds(e.min.divideBy(n)._floor(), e.max.divideBy(n)._floor()),
                        this._addTilesFromCenterOut(o),
                        (this.options.unloadInvisibleTiles || this.options.reuseTiles) && this._removeOtherTiles(o)))
                    },
                    _addTilesFromCenterOut: function(t) {
                        for (var e, i, n = [], o = t.getCenter(), s = t.min.y; s <= t.max.y; s++)
                            for (e = t.min.x; e <= t.max.x; e++)
                                i = new _.Point(e,s),
                                this._tileShouldBeLoaded(i) && n.push(i);
                        var a = n.length;
                        if (0 !== a) {
                            n.sort(function(t, e) {
                                return t.distanceTo(o) - e.distanceTo(o)
                            });
                            var r = p.createDocumentFragment();
                            for (this._tilesToLoad || this.fire("loading"),
                            this._tilesToLoad += a,
                            e = 0; e < a; e++)
                                this._addTile(n[e], r);
                            this._tileContainer.appendChild(r)
                        }
                    },
                    _tileShouldBeLoaded: function(t) {
                        if (t.x + ":" + t.y in this._tiles)
                            return !1;
                        var e = this.options;
                        if (!e.continuousWorld) {
                            var i = this._getWrapTileNum();
                            if (e.noWrap && (t.x < 0 || t.x >= i.x) || t.y < 0 || t.y >= i.y)
                                return !1
                        }
                        if (e.bounds) {
                            var n = e.tileSize
                              , o = t.multiplyBy(n)
                              , s = o.add([n, n])
                              , a = this._map.unproject(o)
                              , r = this._map.unproject(s);
                            if (e.continuousWorld || e.noWrap || (a = a.wrap(),
                            r = r.wrap()),
                            !e.bounds.intersects([a, r]))
                                return !1
                        }
                        return !0
                    },
                    _removeOtherTiles: function(t) {
                        var e, i, n, o;
                        for (o in this._tiles)
                            e = o.split(":"),
                            i = parseInt(e[0], 10),
                            n = parseInt(e[1], 10),
                            (i < t.min.x || i > t.max.x || n < t.min.y || n > t.max.y) && this._removeTile(o)
                    },
                    _removeTile: function(t) {
                        var e = this._tiles[t];
                        this.fire("tileunload", {
                            tile: e,
                            url: e.src
                        }),
                        this.options.reuseTiles ? (_.DomUtil.removeClass(e, "leaflet-tile-loaded"),
                        this._unusedTiles.push(e)) : e.parentNode === this._tileContainer && this._tileContainer.removeChild(e),
                        _.Browser.android || (e.onload = null,
                        e.src = _.Util.emptyImageUrl),
                        delete this._tiles[t]
                    },
                    _addTile: function(t, e) {
                        var i = this._getTilePos(t)
                          , n = this._getTile();
                        _.DomUtil.setPosition(n, i, _.Browser.chrome),
                        this._tiles[t.x + ":" + t.y] = n,
                        this._loadTile(n, t),
                        n.parentNode !== this._tileContainer && e.appendChild(n)
                    },
                    _getZoomForUrl: function() {
                        var t = this.options
                          , e = this._map.getZoom();
                        return t.zoomReverse && (e = t.maxZoom - e),
                        e += t.zoomOffset,
                        t.maxNativeZoom ? Math.min(e, t.maxNativeZoom) : e
                    },
                    _getTilePos: function(t) {
                        var e = this._map.getPixelOrigin()
                          , i = this._getTileSize();
                        return t.multiplyBy(i).subtract(e)
                    },
                    getTileUrl: function(t) {
                        return _.Util.template(this._url, _.extend({
                            s: this._getSubdomain(t),
                            z: t.z,
                            x: t.x,
                            y: t.y
                        }, this.options))
                    },
                    _getWrapTileNum: function() {
                        return this._map.options.crs.getSize(this._map.getZoom()).divideBy(this._getTileSize())._floor()
                    },
                    _adjustTilePoint: function(t) {
                        var e = this._getWrapTileNum();
                        this.options.continuousWorld || this.options.noWrap || (t.x = (t.x % e.x + e.x) % e.x),
                        this.options.tms && (t.y = e.y - t.y - 1),
                        t.z = this._getZoomForUrl()
                    },
                    _getSubdomain: function(t) {
                        var e = Math.abs(t.x + t.y) % this.options.subdomains.length;
                        return this.options.subdomains[e]
                    },
                    _getTile: function() {
                        if (this.options.reuseTiles && 0 < this._unusedTiles.length) {
                            var t = this._unusedTiles.pop();
                            return this._resetTile(t),
                            t
                        }
                        return this._createTile()
                    },
                    _resetTile: function() {},
                    _createTile: function() {
                        var t = _.DomUtil.create("img", "leaflet-tile");
                        return t.style.width = t.style.height = this._getTileSize() + "px",
                        t.galleryimg = "no",
                        t.onselectstart = t.onmousemove = _.Util.falseFn,
                        _.Browser.ielt9 && this.options.opacity !== a && _.DomUtil.setOpacity(t, this.options.opacity),
                        _.Browser.mobileWebkit3d && (t.style.WebkitBackfaceVisibility = "hidden"),
                        t
                    },
                    _loadTile: function(t, e) {
                        t._layer = this,
                        t.onload = this._tileOnLoad,
                        t.onerror = this._tileOnError,
                        this._adjustTilePoint(e),
                        t.src = this.getTileUrl(e),
                        this.fire("tileloadstart", {
                            tile: t,
                            url: t.src
                        })
                    },
                    _tileLoaded: function() {
                        this._tilesToLoad--,
                        this._animated && _.DomUtil.addClass(this._tileContainer, "leaflet-zoom-animated"),
                        this._tilesToLoad || (this.fire("load"),
                        this._animated && (clearTimeout(this._clearBgBufferTimer),
                        this._clearBgBufferTimer = setTimeout(_.bind(this._clearBgBuffer, this), 500)))
                    },
                    _tileOnLoad: function() {
                        var t = this._layer;
                        this.src !== _.Util.emptyImageUrl && (_.DomUtil.addClass(this, "leaflet-tile-loaded"),
                        t.fire("tileload", {
                            tile: this,
                            url: this.src
                        })),
                        t._tileLoaded()
                    },
                    _tileOnError: function() {
                        var t = this._layer;
                        t.fire("tileerror", {
                            tile: this,
                            url: this.src
                        });
                        var e = t.options.errorTileUrl;
                        e && (this.src = e),
                        t._tileLoaded()
                    }
                }),
                _.tileLayer = function(t, e) {
                    return new _.TileLayer(t,e)
                }
                ,
                _.TileLayer.WMS = _.TileLayer.extend({
                    defaultWmsParams: {
                        service: "WMS",
                        request: "GetMap",
                        version: "1.1.1",
                        layers: "",
                        styles: "",
                        format: "image/jpeg",
                        transparent: !1
                    },
                    initialize: function(t, e) {
                        this._url = t;
                        var i = _.extend({}, this.defaultWmsParams)
                          , n = e.tileSize || this.options.tileSize;
                        for (var o in e.detectRetina && _.Browser.retina ? i.width = i.height = 2 * n : i.width = i.height = n,
                        e)
                            this.options.hasOwnProperty(o) || "crs" === o || (i[o] = e[o]);
                        this.wmsParams = i,
                        _.setOptions(this, e)
                    },
                    onAdd: function(t) {
                        this._crs = this.options.crs || t.options.crs,
                        this._wmsVersion = parseFloat(this.wmsParams.version);
                        var e = 1.3 <= this._wmsVersion ? "crs" : "srs";
                        this.wmsParams[e] = this._crs.code,
                        _.TileLayer.prototype.onAdd.call(this, t)
                    },
                    getTileUrl: function(t) {
                        var e = this._map
                          , i = this.options.tileSize
                          , n = t.multiplyBy(i)
                          , o = n.add([i, i])
                          , s = this._crs.project(e.unproject(n, t.z))
                          , a = this._crs.project(e.unproject(o, t.z))
                          , r = 1.3 <= this._wmsVersion && this._crs === _.CRS.EPSG4326 ? [a.y, s.x, s.y, a.x].join(",") : [s.x, a.y, a.x, s.y].join(",")
                          , h = _.Util.template(this._url, {
                            s: this._getSubdomain(t)
                        });
                        return h + _.Util.getParamString(this.wmsParams, h, !0) + "&BBOX=" + r
                    },
                    setParams: function(t, e) {
                        return _.extend(this.wmsParams, t),
                        e || this.redraw(),
                        this
                    }
                }),
                _.tileLayer.wms = function(t, e) {
                    return new _.TileLayer.WMS(t,e)
                }
                ,
                _.TileLayer.Canvas = _.TileLayer.extend({
                    options: {
                        async: !1
                    },
                    initialize: function(t) {
                        _.setOptions(this, t)
                    },
                    redraw: function() {
                        for (var t in this._map && (this._reset({
                            hard: !0
                        }),
                        this._update()),
                        this._tiles)
                            this._redrawTile(this._tiles[t]);
                        return this
                    },
                    _redrawTile: function(t) {
                        this.drawTile(t, t._tilePoint, this._map._zoom)
                    },
                    _createTile: function() {
                        var t = _.DomUtil.create("canvas", "leaflet-tile");
                        return t.width = t.height = this.options.tileSize,
                        t.onselectstart = t.onmousemove = _.Util.falseFn,
                        t
                    },
                    _loadTile: function(t, e) {
                        t._layer = this,
                        t._tilePoint = e,
                        this._redrawTile(t),
                        this.options.async || this.tileDrawn(t)
                    },
                    drawTile: function() {},
                    tileDrawn: function(t) {
                        this._tileOnLoad.call(t)
                    }
                }),
                _.tileLayer.canvas = function(t) {
                    return new _.TileLayer.Canvas(t)
                }
                ,
                _.ImageOverlay = _.Class.extend({
                    includes: _.Mixin.Events,
                    options: {
                        opacity: 1
                    },
                    initialize: function(t, e, i) {
                        this._url = t,
                        this._bounds = _.latLngBounds(e),
                        _.setOptions(this, i)
                    },
                    onAdd: function(t) {
                        this._map = t,
                        this._image || this._initImage(),
                        t._panes.overlayPane.appendChild(this._image),
                        t.on("viewreset", this._reset, this),
                        t.options.zoomAnimation && _.Browser.any3d && t.on("zoomanim", this._animateZoom, this),
                        this._reset()
                    },
                    onRemove: function(t) {
                        t.getPanes().overlayPane.removeChild(this._image),
                        t.off("viewreset", this._reset, this),
                        t.options.zoomAnimation && t.off("zoomanim", this._animateZoom, this)
                    },
                    addTo: function(t) {
                        return t.addLayer(this),
                        this
                    },
                    setOpacity: function(t) {
                        return this.options.opacity = t,
                        this._updateOpacity(),
                        this
                    },
                    bringToFront: function() {
                        return this._image && this._map._panes.overlayPane.appendChild(this._image),
                        this
                    },
                    bringToBack: function() {
                        var t = this._map._panes.overlayPane;
                        return this._image && t.insertBefore(this._image, t.firstChild),
                        this
                    },
                    setUrl: function(t) {
                        this._url = t,
                        this._image.src = this._url
                    },
                    getAttribution: function() {
                        return this.options.attribution
                    },
                    _initImage: function() {
                        this._image = _.DomUtil.create("img", "leaflet-image-layer"),
                        this._map.options.zoomAnimation && _.Browser.any3d ? _.DomUtil.addClass(this._image, "leaflet-zoom-animated") : _.DomUtil.addClass(this._image, "leaflet-zoom-hide"),
                        this._updateOpacity(),
                        _.extend(this._image, {
                            galleryimg: "no",
                            onselectstart: _.Util.falseFn,
                            onmousemove: _.Util.falseFn,
                            onload: _.bind(this._onImageLoad, this),
                            src: this._url
                        })
                    },
                    _animateZoom: function(t) {
                        var e = this._map
                          , i = this._image
                          , n = e.getZoomScale(t.zoom)
                          , o = this._bounds.getNorthWest()
                          , s = this._bounds.getSouthEast()
                          , a = e._latLngToNewLayerPoint(o, t.zoom, t.center)
                          , r = e._latLngToNewLayerPoint(s, t.zoom, t.center)._subtract(a)
                          , h = a._add(r._multiplyBy(.5 * (1 - 1 / n)));
                        i.style[_.DomUtil.TRANSFORM] = _.DomUtil.getTranslateString(h) + " scale(" + n + ") "
                    },
                    _reset: function() {
                        var t = this._image
                          , e = this._map.latLngToLayerPoint(this._bounds.getNorthWest())
                          , i = this._map.latLngToLayerPoint(this._bounds.getSouthEast())._subtract(e);
                        _.DomUtil.setPosition(t, e),
                        t.style.width = i.x + "px",
                        t.style.height = i.y + "px"
                    },
                    _onImageLoad: function() {
                        this.fire("load")
                    },
                    _updateOpacity: function() {
                        _.DomUtil.setOpacity(this._image, this.options.opacity)
                    }
                }),
                _.imageOverlay = function(t, e, i) {
                    return new _.ImageOverlay(t,e,i)
                }
                ,
                _.Icon = _.Class.extend({
                    options: {
                        className: ""
                    },
                    initialize: function(t) {
                        _.setOptions(this, t)
                    },
                    createIcon: function(t) {
                        return this._createIcon("icon", t)
                    },
                    createShadow: function(t) {
                        return this._createIcon("shadow", t)
                    },
                    _createIcon: function(t, e) {
                        var i, n = this._getIconUrl(t);
                        if (n)
                            return i = e && "IMG" === e.tagName ? this._createImg(n, e) : this._createImg(n),
                            this._setIconStyles(i, t),
                            i;
                        if ("icon" === t)
                            throw new Error("iconUrl not set in Icon options (see the docs).");
                        return null
                    },
                    _setIconStyles: function(t, e) {
                        var i = this.options
                          , n = _.point(i[e + "Size"])
                          , o = "shadow" === e ? _.point(i.shadowAnchor || i.iconAnchor) : _.point(i.iconAnchor);
                        !o && n && (o = n.divideBy(2, !0)),
                        t.className = "leaflet-marker-" + e + " " + i.className,
                        o && (t.style.marginLeft = -o.x + "px",
                        t.style.marginTop = -o.y + "px"),
                        n && (t.style.width = n.x + "px",
                        t.style.height = n.y + "px")
                    },
                    _createImg: function(t, e) {
                        return (e = e || p.createElement("img")).src = t,
                        e
                    },
                    _getIconUrl: function(t) {
                        return _.Browser.retina && this.options[t + "RetinaUrl"] ? this.options[t + "RetinaUrl"] : this.options[t + "Url"]
                    }
                }),
                _.icon = function(t) {
                    return new _.Icon(t)
                }
                ,
                _.Icon.Default = _.Icon.extend({
                    options: {
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41]
                    },
                    _getIconUrl: function(t) {
                        var e = t + "Url";
                        if (this.options[e])
                            return this.options[e];
                        _.Browser.retina && "icon" === t && (t += "-2x");
                        var i = _.Icon.Default.imagePath;
                        if (!i)
                            throw new Error("Couldn't autodetect L.Icon.Default.imagePath, set it manually.");
                        return i + "/marker-" + t + ".png"
                    }
                }),
                _.Icon.Default.imagePath = function() {
                    for (var t, e, i = p.getElementsByTagName("script"), n = /[\/^]leaflet[\-\._]?([\w\-\._]*)\.js\??/, o = 0, s = i.length; o < s; o++)
                        if ((t = i[o].src).match(n))
                            return ((e = t.split(n)[0]) ? e + "/" : "") + "images"
                }(),
                _.Marker = _.Class.extend({
                    includes: _.Mixin.Events,
                    options: {
                        icon: new _.Icon.Default,
                        title: "",
                        alt: "",
                        clickable: !0,
                        draggable: !1,
                        keyboard: !0,
                        zIndexOffset: 0,
                        opacity: 1,
                        riseOnHover: !1,
                        riseOffset: 250
                    },
                    initialize: function(t, e) {
                        _.setOptions(this, e),
                        this._latlng = _.latLng(t)
                    },
                    onAdd: function(t) {
                        (this._map = t).on("viewreset", this.update, this),
                        this._initIcon(),
                        this.update(),
                        this.fire("add"),
                        t.options.zoomAnimation && t.options.markerZoomAnimation && t.on("zoomanim", this._animateZoom, this)
                    },
                    addTo: function(t) {
                        return t.addLayer(this),
                        this
                    },
                    onRemove: function(t) {
                        this.dragging && this.dragging.disable(),
                        this._removeIcon(),
                        this._removeShadow(),
                        this.fire("remove"),
                        t.off({
                            viewreset: this.update,
                            zoomanim: this._animateZoom
                        }, this),
                        this._map = null
                    },
                    getLatLng: function() {
                        return this._latlng
                    },
                    setLatLng: function(t) {
                        return this._latlng = _.latLng(t),
                        this.update(),
                        this.fire("move", {
                            latlng: this._latlng
                        })
                    },
                    setZIndexOffset: function(t) {
                        return this.options.zIndexOffset = t,
                        this.update(),
                        this
                    },
                    setIcon: function(t) {
                        return this.options.icon = t,
                        this._map && (this._initIcon(),
                        this.update()),
                        this._popup && this.bindPopup(this._popup),
                        this
                    },
                    update: function() {
                        var t;
                        return this._icon && (t = this._map.latLngToLayerPoint(this._latlng).round(),
                        this._setPos(t)),
                        this
                    },
                    _initIcon: function() {
                        var t = this.options
                          , e = this._map
                          , i = e.options.zoomAnimation && e.options.markerZoomAnimation ? "leaflet-zoom-animated" : "leaflet-zoom-hide"
                          , n = t.icon.createIcon(this._icon)
                          , o = !1;
                        n !== this._icon && (this._icon && this._removeIcon(),
                        o = !0,
                        t.title && (n.title = t.title),
                        t.alt && (n.alt = t.alt)),
                        _.DomUtil.addClass(n, i),
                        t.keyboard && (n.tabIndex = "0"),
                        this._icon = n,
                        this._initInteraction(),
                        t.riseOnHover && _.DomEvent.on(n, "mouseover", this._bringToFront, this).on(n, "mouseout", this._resetZIndex, this);
                        var s = t.icon.createShadow(this._shadow)
                          , a = !1;
                        s !== this._shadow && (this._removeShadow(),
                        a = !0),
                        s && _.DomUtil.addClass(s, i),
                        this._shadow = s,
                        t.opacity < 1 && this._updateOpacity();
                        var r = this._map._panes;
                        o && r.markerPane.appendChild(this._icon),
                        s && a && r.shadowPane.appendChild(this._shadow)
                    },
                    _removeIcon: function() {
                        this.options.riseOnHover && _.DomEvent.off(this._icon, "mouseover", this._bringToFront).off(this._icon, "mouseout", this._resetZIndex),
                        this._map._panes.markerPane.removeChild(this._icon),
                        this._icon = null
                    },
                    _removeShadow: function() {
                        this._shadow && this._map._panes.shadowPane.removeChild(this._shadow),
                        this._shadow = null
                    },
                    _setPos: function(t) {
                        _.DomUtil.setPosition(this._icon, t),
                        this._shadow && _.DomUtil.setPosition(this._shadow, t),
                        this._zIndex = t.y + this.options.zIndexOffset,
                        this._resetZIndex()
                    },
                    _updateZIndex: function(t) {
                        this._icon.style.zIndex = this._zIndex + t
                    },
                    _animateZoom: function(t) {
                        var e = this._map._latLngToNewLayerPoint(this._latlng, t.zoom, t.center).round();
                        this._setPos(e)
                    },
                    _initInteraction: function() {
                        if (this.options.clickable) {
                            var t = this._icon
                              , e = ["dblclick", "mousedown", "mouseover", "mouseout", "contextmenu"];
                            _.DomUtil.addClass(t, "leaflet-clickable"),
                            _.DomEvent.on(t, "click", this._onMouseClick, this),
                            _.DomEvent.on(t, "keypress", this._onKeyPress, this);
                            for (var i = 0; i < e.length; i++)
                                _.DomEvent.on(t, e[i], this._fireMouseEvent, this);
                            _.Handler.MarkerDrag && (this.dragging = new _.Handler.MarkerDrag(this),
                            this.options.draggable && this.dragging.enable())
                        }
                    },
                    _onMouseClick: function(t) {
                        var e = this.dragging && this.dragging.moved();
                        (this.hasEventListeners(t.type) || e) && _.DomEvent.stopPropagation(t),
                        e || (this.dragging && this.dragging._enabled || !this._map.dragging || !this._map.dragging.moved()) && this.fire(t.type, {
                            originalEvent: t,
                            latlng: this._latlng
                        })
                    },
                    _onKeyPress: function(t) {
                        13 === t.keyCode && this.fire("click", {
                            originalEvent: t,
                            latlng: this._latlng
                        })
                    },
                    _fireMouseEvent: function(t) {
                        this.fire(t.type, {
                            originalEvent: t,
                            latlng: this._latlng
                        }),
                        "contextmenu" === t.type && this.hasEventListeners(t.type) && _.DomEvent.preventDefault(t),
                        "mousedown" !== t.type ? _.DomEvent.stopPropagation(t) : _.DomEvent.preventDefault(t)
                    },
                    setOpacity: function(t) {
                        return this.options.opacity = t,
                        this._map && this._updateOpacity(),
                        this
                    },
                    _updateOpacity: function() {
                        _.DomUtil.setOpacity(this._icon, this.options.opacity),
                        this._shadow && _.DomUtil.setOpacity(this._shadow, this.options.opacity)
                    },
                    _bringToFront: function() {
                        this._updateZIndex(this.options.riseOffset)
                    },
                    _resetZIndex: function() {
                        this._updateZIndex(0)
                    }
                }),
                _.marker = function(t, e) {
                    return new _.Marker(t,e)
                }
                ,
                _.DivIcon = _.Icon.extend({
                    options: {
                        iconSize: [12, 12],
                        className: "leaflet-div-icon",
                        html: !1
                    },
                    createIcon: function(t) {
                        var e = t && "DIV" === t.tagName ? t : p.createElement("div")
                          , i = this.options;
                        return !1 !== i.html ? e.innerHTML = i.html : e.innerHTML = "",
                        i.bgPos && (e.style.backgroundPosition = -i.bgPos.x + "px " + -i.bgPos.y + "px"),
                        this._setIconStyles(e, "icon"),
                        e
                    },
                    createShadow: function() {
                        return null
                    }
                }),
                _.divIcon = function(t) {
                    return new _.DivIcon(t)
                }
                ,
                _.Map.mergeOptions({
                    closePopupOnClick: !0
                }),
                _.Popup = _.Class.extend({
                    includes: _.Mixin.Events,
                    options: {
                        minWidth: 50,
                        maxWidth: 300,
                        autoPan: !0,
                        closeButton: !0,
                        offset: [0, 7],
                        autoPanPadding: [5, 5],
                        keepInView: !1,
                        className: "",
                        zoomAnimation: !0
                    },
                    initialize: function(t, e) {
                        _.setOptions(this, t),
                        this._source = e,
                        this._animated = _.Browser.any3d && this.options.zoomAnimation,
                        this._isOpen = !1
                    },
                    onAdd: function(t) {
                        this._map = t,
                        this._container || this._initLayout();
                        var e = t.options.fadeAnimation;
                        e && _.DomUtil.setOpacity(this._container, 0),
                        t._panes.popupPane.appendChild(this._container),
                        t.on(this._getEvents(), this),
                        this.update(),
                        e && _.DomUtil.setOpacity(this._container, 1),
                        this.fire("open"),
                        t.fire("popupopen", {
                            popup: this
                        }),
                        this._source && this._source.fire("popupopen", {
                            popup: this
                        })
                    },
                    addTo: function(t) {
                        return t.addLayer(this),
                        this
                    },
                    openOn: function(t) {
                        return t.openPopup(this),
                        this
                    },
                    onRemove: function(t) {
                        t._panes.popupPane.removeChild(this._container),
                        _.Util.falseFn(this._container.offsetWidth),
                        t.off(this._getEvents(), this),
                        t.options.fadeAnimation && _.DomUtil.setOpacity(this._container, 0),
                        this._map = null,
                        this.fire("close"),
                        t.fire("popupclose", {
                            popup: this
                        }),
                        this._source && this._source.fire("popupclose", {
                            popup: this
                        })
                    },
                    getLatLng: function() {
                        return this._latlng
                    },
                    setLatLng: function(t) {
                        return this._latlng = _.latLng(t),
                        this._map && (this._updatePosition(),
                        this._adjustPan()),
                        this
                    },
                    getContent: function() {
                        return this._content
                    },
                    setContent: function(t) {
                        return this._content = t,
                        this.update(),
                        this
                    },
                    update: function() {
                        this._map && (this._container.style.visibility = "hidden",
                        this._updateContent(),
                        this._updateLayout(),
                        this._updatePosition(),
                        this._container.style.visibility = "",
                        this._adjustPan())
                    },
                    _getEvents: function() {
                        var t = {
                            viewreset: this._updatePosition
                        };
                        return this._animated && (t.zoomanim = this._zoomAnimation),
                        ("closeOnClick"in this.options ? this.options.closeOnClick : this._map.options.closePopupOnClick) && (t.preclick = this._close),
                        this.options.keepInView && (t.moveend = this._adjustPan),
                        t
                    },
                    _close: function() {
                        this._map && this._map.closePopup(this)
                    },
                    _initLayout: function() {
                        var t, e = "leaflet-popup", i = e + " " + this.options.className + " leaflet-zoom-" + (this._animated ? "animated" : "hide"), n = this._container = _.DomUtil.create("div", i);
                        this.options.closeButton && ((t = this._closeButton = _.DomUtil.create("a", e + "-close-button", n)).href = "#close",
                        t.innerHTML = "&#215;",
                        _.DomEvent.disableClickPropagation(t),
                        _.DomEvent.on(t, "click", this._onCloseButtonClick, this));
                        var o = this._wrapper = _.DomUtil.create("div", e + "-content-wrapper", n);
                        _.DomEvent.disableClickPropagation(o),
                        this._contentNode = _.DomUtil.create("div", e + "-content", o),
                        _.DomEvent.disableScrollPropagation(this._contentNode),
                        _.DomEvent.on(o, "contextmenu", _.DomEvent.stopPropagation),
                        this._tipContainer = _.DomUtil.create("div", e + "-tip-container", n),
                        this._tip = _.DomUtil.create("div", e + "-tip", this._tipContainer)
                    },
                    _updateContent: function() {
                        if (this._content) {
                            if ("string" == typeof this._content)
                                this._contentNode.innerHTML = this._content;
                            else {
                                for (; this._contentNode.hasChildNodes(); )
                                    this._contentNode.removeChild(this._contentNode.firstChild);
                                this._contentNode.appendChild(this._content)
                            }
                            this.fire("contentupdate")
                        }
                    },
                    _updateLayout: function() {
                        var t = this._contentNode
                          , e = t.style;
                        e.width = "",
                        e.whiteSpace = "nowrap";
                        var i = t.offsetWidth
                          , i = Math.min(i, this.options.maxWidth);
                        i = Math.max(i, this.options.minWidth),
                        e.width = i + 1 + "px",
                        e.whiteSpace = "",
                        e.height = "";
                        var n = t.offsetHeight
                          , o = this.options.maxHeight
                          , s = "leaflet-popup-scrolled";
                        o && o < n ? (e.height = o + "px",
                        _.DomUtil.addClass(t, s)) : _.DomUtil.removeClass(t, s),
                        this._containerWidth = this._container.offsetWidth
                    },
                    _updatePosition: function() {
                        var t, e, i;
                        this._map && (t = this._map.latLngToLayerPoint(this._latlng),
                        e = this._animated,
                        i = _.point(this.options.offset),
                        e && _.DomUtil.setPosition(this._container, t),
                        this._containerBottom = -i.y - (e ? 0 : t.y),
                        this._containerLeft = -Math.round(this._containerWidth / 2) + i.x + (e ? 0 : t.x),
                        this._container.style.bottom = this._containerBottom + "px",
                        this._container.style.left = this._containerLeft + "px")
                    },
                    _zoomAnimation: function(t) {
                        var e = this._map._latLngToNewLayerPoint(this._latlng, t.zoom, t.center);
                        _.DomUtil.setPosition(this._container, e)
                    },
                    _adjustPan: function() {
                        var t, e, i, n, o, s, a, r, h, l, u;
                        this.options.autoPan && (t = this._map,
                        e = this._container.offsetHeight,
                        i = this._containerWidth,
                        n = new _.Point(this._containerLeft,-e - this._containerBottom),
                        this._animated && n._add(_.DomUtil.getPosition(this._container)),
                        o = t.layerPointToContainerPoint(n),
                        s = _.point(this.options.autoPanPadding),
                        a = _.point(this.options.autoPanPaddingTopLeft || s),
                        r = _.point(this.options.autoPanPaddingBottomRight || s),
                        h = t.getSize(),
                        u = l = 0,
                        o.x + i + r.x > h.x && (l = o.x + i - h.x + r.x),
                        o.x - l - a.x < 0 && (l = o.x - a.x),
                        o.y + e + r.y > h.y && (u = o.y + e - h.y + r.y),
                        o.y - u - a.y < 0 && (u = o.y - a.y),
                        (l || u) && t.fire("autopanstart").panBy([l, u]))
                    },
                    _onCloseButtonClick: function(t) {
                        this._close(),
                        _.DomEvent.stop(t)
                    }
                }),
                _.popup = function(t, e) {
                    return new _.Popup(t,e)
                }
                ,
                _.Map.include({
                    openPopup: function(t, e, i) {
                        var n;
                        return this.closePopup(),
                        t instanceof _.Popup || (n = t,
                        t = new _.Popup(i).setLatLng(e).setContent(n)),
                        t._isOpen = !0,
                        this._popup = t,
                        this.addLayer(t)
                    },
                    closePopup: function(t) {
                        return t && t !== this._popup || (t = this._popup,
                        this._popup = null),
                        t && (this.removeLayer(t),
                        t._isOpen = !1),
                        this
                    }
                }),
                _.Marker.include({
                    openPopup: function() {
                        return this._popup && this._map && !this._map.hasLayer(this._popup) && (this._popup.setLatLng(this._latlng),
                        this._map.openPopup(this._popup)),
                        this
                    },
                    closePopup: function() {
                        return this._popup && this._popup._close(),
                        this
                    },
                    togglePopup: function() {
                        return this._popup && (this._popup._isOpen ? this.closePopup() : this.openPopup()),
                        this
                    },
                    bindPopup: function(t, e) {
                        var i = (i = _.point(this.options.icon.options.popupAnchor || [0, 0])).add(_.Popup.prototype.options.offset);
                        return e && e.offset && (i = i.add(e.offset)),
                        e = _.extend({
                            offset: i
                        }, e),
                        this._popupHandlersAdded || (this.on("click", this.togglePopup, this).on("remove", this.closePopup, this).on("move", this._movePopup, this),
                        this._popupHandlersAdded = !0),
                        t instanceof _.Popup ? (_.setOptions(t, e),
                        this._popup = t) : this._popup = new _.Popup(e,this).setContent(t),
                        this
                    },
                    setPopupContent: function(t) {
                        return this._popup && this._popup.setContent(t),
                        this
                    },
                    unbindPopup: function() {
                        return this._popup && (this._popup = null,
                        this.off("click", this.togglePopup, this).off("remove", this.closePopup, this).off("move", this._movePopup, this),
                        this._popupHandlersAdded = !1),
                        this
                    },
                    getPopup: function() {
                        return this._popup
                    },
                    _movePopup: function(t) {
                        this._popup.setLatLng(t.latlng)
                    }
                }),
                _.LayerGroup = _.Class.extend({
                    initialize: function(t) {
                        var e, i;
                        if (this._layers = {},
                        t)
                            for (e = 0,
                            i = t.length; e < i; e++)
                                this.addLayer(t[e])
                    },
                    addLayer: function(t) {
                        var e = this.getLayerId(t);
                        return this._layers[e] = t,
                        this._map && this._map.addLayer(t),
                        this
                    },
                    removeLayer: function(t) {
                        var e = t in this._layers ? t : this.getLayerId(t);
                        return this._map && this._layers[e] && this._map.removeLayer(this._layers[e]),
                        delete this._layers[e],
                        this
                    },
                    hasLayer: function(t) {
                        return !!t && (t in this._layers || this.getLayerId(t)in this._layers)
                    },
                    clearLayers: function() {
                        return this.eachLayer(this.removeLayer, this),
                        this
                    },
                    invoke: function(t) {
                        var e, i, n = Array.prototype.slice.call(arguments, 1);
                        for (e in this._layers)
                            (i = this._layers[e])[t] && i[t].apply(i, n);
                        return this
                    },
                    onAdd: function(t) {
                        this._map = t,
                        this.eachLayer(t.addLayer, t)
                    },
                    onRemove: function(t) {
                        this.eachLayer(t.removeLayer, t),
                        this._map = null
                    },
                    addTo: function(t) {
                        return t.addLayer(this),
                        this
                    },
                    eachLayer: function(t, e) {
                        for (var i in this._layers)
                            t.call(e, this._layers[i]);
                        return this
                    },
                    getLayer: function(t) {
                        return this._layers[t]
                    },
                    getLayers: function() {
                        var t = [];
                        for (var e in this._layers)
                            t.push(this._layers[e]);
                        return t
                    },
                    setZIndex: function(t) {
                        return this.invoke("setZIndex", t)
                    },
                    getLayerId: function(t) {
                        return _.stamp(t)
                    }
                }),
                _.layerGroup = function(t) {
                    return new _.LayerGroup(t)
                }
                ,
                _.FeatureGroup = _.LayerGroup.extend({
                    includes: _.Mixin.Events,
                    statics: {
                        EVENTS: "click dblclick mouseover mouseout mousemove contextmenu popupopen popupclose"
                    },
                    addLayer: function(t) {
                        return this.hasLayer(t) ? this : ("on"in t && t.on(_.FeatureGroup.EVENTS, this._propagateEvent, this),
                        _.LayerGroup.prototype.addLayer.call(this, t),
                        this._popupContent && t.bindPopup && t.bindPopup(this._popupContent, this._popupOptions),
                        this.fire("layeradd", {
                            layer: t
                        }))
                    },
                    removeLayer: function(t) {
                        return this.hasLayer(t) ? (t in this._layers && (t = this._layers[t]),
                        t.off(_.FeatureGroup.EVENTS, this._propagateEvent, this),
                        _.LayerGroup.prototype.removeLayer.call(this, t),
                        this._popupContent && this.invoke("unbindPopup"),
                        this.fire("layerremove", {
                            layer: t
                        })) : this
                    },
                    bindPopup: function(t, e) {
                        return this._popupContent = t,
                        this._popupOptions = e,
                        this.invoke("bindPopup", t, e)
                    },
                    openPopup: function(t) {
                        for (var e in this._layers) {
                            this._layers[e].openPopup(t);
                            break
                        }
                        return this
                    },
                    setStyle: function(t) {
                        return this.invoke("setStyle", t)
                    },
                    bringToFront: function() {
                        return this.invoke("bringToFront")
                    },
                    bringToBack: function() {
                        return this.invoke("bringToBack")
                    },
                    getBounds: function() {
                        var e = new _.LatLngBounds;
                        return this.eachLayer(function(t) {
                            e.extend(t instanceof _.Marker ? t.getLatLng() : t.getBounds())
                        }),
                        e
                    },
                    _propagateEvent: function(t) {
                        t = _.extend({
                            layer: t.target,
                            target: this
                        }, t),
                        this.fire(t.type, t)
                    }
                }),
                _.featureGroup = function(t) {
                    return new _.FeatureGroup(t)
                }
                ,
                _.Path = _.Class.extend({
                    includes: [_.Mixin.Events],
                    statics: {
                        CLIP_PADDING: (A = ((_.Browser.mobile ? 1280 : 2e3) / Math.max(s.outerWidth, s.outerHeight) - 1) / 2,
                        Math.max(0, Math.min(.5, A)))
                    },
                    options: {
                        stroke: !0,
                        color: "#0033ff",
                        dashArray: null,
                        lineCap: null,
                        lineJoin: null,
                        weight: 5,
                        opacity: .5,
                        fill: !1,
                        fillColor: null,
                        fillOpacity: .2,
                        clickable: !0
                    },
                    initialize: function(t) {
                        _.setOptions(this, t)
                    },
                    onAdd: function(t) {
                        this._map = t,
                        this._container || (this._initElements(),
                        this._initEvents()),
                        this.projectLatlngs(),
                        this._updatePath(),
                        this._container && this._map._pathRoot.appendChild(this._container),
                        this.fire("add"),
                        t.on({
                            viewreset: this.projectLatlngs,
                            moveend: this._updatePath
                        }, this)
                    },
                    addTo: function(t) {
                        return t.addLayer(this),
                        this
                    },
                    onRemove: function(t) {
                        t._pathRoot.removeChild(this._container),
                        this.fire("remove"),
                        this._map = null,
                        _.Browser.vml && (this._container = null,
                        this._stroke = null,
                        this._fill = null),
                        t.off({
                            viewreset: this.projectLatlngs,
                            moveend: this._updatePath
                        }, this)
                    },
                    projectLatlngs: function() {},
                    setStyle: function(t) {
                        return _.setOptions(this, t),
                        this._container && this._updateStyle(),
                        this
                    },
                    redraw: function() {
                        return this._map && (this.projectLatlngs(),
                        this._updatePath()),
                        this
                    }
                }),
                _.Map.include({
                    _updatePathViewport: function() {
                        var t = _.Path.CLIP_PADDING
                          , e = this.getSize()
                          , i = _.DomUtil.getPosition(this._mapPane).multiplyBy(-1)._subtract(e.multiplyBy(t)._round())
                          , n = i.add(e.multiplyBy(1 + 2 * t)._round());
                        this._pathViewport = new _.Bounds(i,n)
                    }
                }),
                _.Path.SVG_NS = "http://www.w3.org/2000/svg",
                _.Browser.svg = !(!p.createElementNS || !p.createElementNS(_.Path.SVG_NS, "svg").createSVGRect),
                _.Path = _.Path.extend({
                    statics: {
                        SVG: _.Browser.svg
                    },
                    bringToFront: function() {
                        var t = this._map._pathRoot
                          , e = this._container;
                        return e && t.lastChild !== e && t.appendChild(e),
                        this
                    },
                    bringToBack: function() {
                        var t = this._map._pathRoot
                          , e = this._container
                          , i = t.firstChild;
                        return e && i !== e && t.insertBefore(e, i),
                        this
                    },
                    getPathString: function() {},
                    _createElement: function(t) {
                        return p.createElementNS(_.Path.SVG_NS, t)
                    },
                    _initElements: function() {
                        this._map._initPathRoot(),
                        this._initPath(),
                        this._initStyle()
                    },
                    _initPath: function() {
                        this._container = this._createElement("g"),
                        this._path = this._createElement("path"),
                        this.options.className && _.DomUtil.addClass(this._path, this.options.className),
                        this._container.appendChild(this._path)
                    },
                    _initStyle: function() {
                        this.options.stroke && (this._path.setAttribute("stroke-linejoin", "round"),
                        this._path.setAttribute("stroke-linecap", "round")),
                        this.options.fill && this._path.setAttribute("fill-rule", "evenodd"),
                        this.options.pointerEvents && this._path.setAttribute("pointer-events", this.options.pointerEvents),
                        this.options.clickable || this.options.pointerEvents || this._path.setAttribute("pointer-events", "none"),
                        this._updateStyle()
                    },
                    _updateStyle: function() {
                        this.options.stroke ? (this._path.setAttribute("stroke", this.options.color),
                        this._path.setAttribute("stroke-opacity", this.options.opacity),
                        this._path.setAttribute("stroke-width", this.options.weight),
                        this.options.dashArray ? this._path.setAttribute("stroke-dasharray", this.options.dashArray) : this._path.removeAttribute("stroke-dasharray"),
                        this.options.lineCap && this._path.setAttribute("stroke-linecap", this.options.lineCap),
                        this.options.lineJoin && this._path.setAttribute("stroke-linejoin", this.options.lineJoin)) : this._path.setAttribute("stroke", "none"),
                        this.options.fill ? (this._path.setAttribute("fill", this.options.fillColor || this.options.color),
                        this._path.setAttribute("fill-opacity", this.options.fillOpacity)) : this._path.setAttribute("fill", "none")
                    },
                    _updatePath: function() {
                        var t = (t = this.getPathString()) || "M0 0";
                        this._path.setAttribute("d", t)
                    },
                    _initEvents: function() {
                        if (this.options.clickable) {
                            !_.Browser.svg && _.Browser.vml || _.DomUtil.addClass(this._path, "leaflet-clickable"),
                            _.DomEvent.on(this._container, "click", this._onMouseClick, this);
                            for (var t = ["dblclick", "mousedown", "mouseover", "mouseout", "mousemove", "contextmenu"], e = 0; e < t.length; e++)
                                _.DomEvent.on(this._container, t[e], this._fireMouseEvent, this)
                        }
                    },
                    _onMouseClick: function(t) {
                        this._map.dragging && this._map.dragging.moved() || this._fireMouseEvent(t)
                    },
                    _fireMouseEvent: function(t) {
                        var e, i, n, o;
                        this.hasEventListeners(t.type) && (i = (e = this._map).mouseEventToContainerPoint(t),
                        n = e.containerPointToLayerPoint(i),
                        o = e.layerPointToLatLng(n),
                        this.fire(t.type, {
                            latlng: o,
                            layerPoint: n,
                            containerPoint: i,
                            originalEvent: t
                        }),
                        "contextmenu" === t.type && _.DomEvent.preventDefault(t),
                        "mousemove" !== t.type && _.DomEvent.stopPropagation(t))
                    }
                }),
                _.Map.include({
                    _initPathRoot: function() {
                        this._pathRoot || (this._pathRoot = _.Path.prototype._createElement("svg"),
                        this._panes.overlayPane.appendChild(this._pathRoot),
                        this.options.zoomAnimation && _.Browser.any3d ? (_.DomUtil.addClass(this._pathRoot, "leaflet-zoom-animated"),
                        this.on({
                            zoomanim: this._animatePathZoom,
                            zoomend: this._endPathZoom
                        })) : _.DomUtil.addClass(this._pathRoot, "leaflet-zoom-hide"),
                        this.on("moveend", this._updateSvgViewport),
                        this._updateSvgViewport())
                    },
                    _animatePathZoom: function(t) {
                        var e = this.getZoomScale(t.zoom)
                          , i = this._getCenterOffset(t.center)._multiplyBy(-e)._add(this._pathViewport.min);
                        this._pathRoot.style[_.DomUtil.TRANSFORM] = _.DomUtil.getTranslateString(i) + " scale(" + e + ") ",
                        this._pathZooming = !0
                    },
                    _endPathZoom: function() {
                        this._pathZooming = !1
                    },
                    _updateSvgViewport: function() {
                        var t, e, i, n, o, s, a;
                        this._pathZooming || (this._updatePathViewport(),
                        e = (t = this._pathViewport).min,
                        n = (i = t.max).x - e.x,
                        o = i.y - e.y,
                        s = this._pathRoot,
                        a = this._panes.overlayPane,
                        _.Browser.mobileWebkit && a.removeChild(s),
                        _.DomUtil.setPosition(s, e),
                        s.setAttribute("width", n),
                        s.setAttribute("height", o),
                        s.setAttribute("viewBox", [e.x, e.y, n, o].join(" ")),
                        _.Browser.mobileWebkit && a.appendChild(s))
                    }
                }),
                _.Path.include({
                    bindPopup: function(t, e) {
                        return t instanceof _.Popup ? this._popup = t : (this._popup && !e || (this._popup = new _.Popup(e,this)),
                        this._popup.setContent(t)),
                        this._popupHandlersAdded || (this.on("click", this._openPopup, this).on("remove", this.closePopup, this),
                        this._popupHandlersAdded = !0),
                        this
                    },
                    unbindPopup: function() {
                        return this._popup && (this._popup = null,
                        this.off("click", this._openPopup).off("remove", this.closePopup),
                        this._popupHandlersAdded = !1),
                        this
                    },
                    openPopup: function(t) {
                        return this._popup && (t = t || this._latlng || this._latlngs[Math.floor(this._latlngs.length / 2)],
                        this._openPopup({
                            latlng: t
                        })),
                        this
                    },
                    closePopup: function() {
                        return this._popup && this._popup._close(),
                        this
                    },
                    _openPopup: function(t) {
                        this._popup.setLatLng(t.latlng),
                        this._map.openPopup(this._popup)
                    }
                }),
                _.Browser.vml = !_.Browser.svg && function() {
                    try {
                        var t = p.createElement("div");
                        t.innerHTML = '<v:shape adj="1"/>';
                        var e = t.firstChild;
                        return e.style.behavior = "url(#default#VML)",
                        e && "object" === W(e.adj)
                    } catch (t) {
                        return !1
                    }
                }(),
                _.Path = _.Browser.svg || !_.Browser.vml ? _.Path : _.Path.extend({
                    statics: {
                        VML: !0,
                        CLIP_PADDING: .02
                    },
                    _createElement: function() {
                        try {
                            return p.namespaces.add("lvml", "urn:schemas-microsoft-com:vml"),
                            function(t) {
                                return p.createElement("<lvml:" + t + ' class="lvml">')
                            }
                        } catch (t) {
                            return function(t) {
                                return p.createElement("<" + t + ' xmlns="urn:schemas-microsoft.com:vml" class="lvml">')
                            }
                        }
                    }(),
                    _initPath: function() {
                        var t = this._container = this._createElement("shape");
                        _.DomUtil.addClass(t, "leaflet-vml-shape" + (this.options.className ? " " + this.options.className : "")),
                        this.options.clickable && _.DomUtil.addClass(t, "leaflet-clickable"),
                        t.coordsize = "1 1",
                        this._path = this._createElement("path"),
                        t.appendChild(this._path),
                        this._map._pathRoot.appendChild(t)
                    },
                    _initStyle: function() {
                        this._updateStyle()
                    },
                    _updateStyle: function() {
                        var t = this._stroke
                          , e = this._fill
                          , i = this.options
                          , n = this._container;
                        n.stroked = i.stroke,
                        n.filled = i.fill,
                        i.stroke ? (t || ((t = this._stroke = this._createElement("stroke")).endcap = "round",
                        n.appendChild(t)),
                        t.weight = i.weight + "px",
                        t.color = i.color,
                        t.opacity = i.opacity,
                        i.dashArray ? t.dashStyle = _.Util.isArray(i.dashArray) ? i.dashArray.join(" ") : i.dashArray.replace(/( *, *)/g, " ") : t.dashStyle = "",
                        i.lineCap && (t.endcap = i.lineCap.replace("butt", "flat")),
                        i.lineJoin && (t.joinstyle = i.lineJoin)) : t && (n.removeChild(t),
                        this._stroke = null),
                        i.fill ? (e || (e = this._fill = this._createElement("fill"),
                        n.appendChild(e)),
                        e.color = i.fillColor || i.color,
                        e.opacity = i.fillOpacity) : e && (n.removeChild(e),
                        this._fill = null)
                    },
                    _updatePath: function() {
                        var t = this._container.style;
                        t.display = "none",
                        this._path.v = this.getPathString() + " ",
                        t.display = ""
                    }
                }),
                _.Map.include(_.Browser.svg || !_.Browser.vml ? {} : {
                    _initPathRoot: function() {
                        var t;
                        this._pathRoot || ((t = this._pathRoot = p.createElement("div")).className = "leaflet-vml-container",
                        this._panes.overlayPane.appendChild(t),
                        this.on("moveend", this._updatePathViewport),
                        this._updatePathViewport())
                    }
                }),
                _.Browser.canvas = !!p.createElement("canvas").getContext,
                _.Path = _.Path.SVG && !s.L_PREFER_CANVAS || !_.Browser.canvas ? _.Path : _.Path.extend({
                    statics: {
                        CANVAS: !0,
                        SVG: !1
                    },
                    redraw: function() {
                        return this._map && (this.projectLatlngs(),
                        this._requestUpdate()),
                        this
                    },
                    setStyle: function(t) {
                        return _.setOptions(this, t),
                        this._map && (this._updateStyle(),
                        this._requestUpdate()),
                        this
                    },
                    onRemove: function(t) {
                        t.off("viewreset", this.projectLatlngs, this).off("moveend", this._updatePath, this),
                        this.options.clickable && (this._map.off("click", this._onClick, this),
                        this._map.off("mousemove", this._onMouseMove, this)),
                        this._requestUpdate(),
                        this.fire("remove"),
                        this._map = null
                    },
                    _requestUpdate: function() {
                        this._map && !_.Path._updateRequest && (_.Path._updateRequest = _.Util.requestAnimFrame(this._fireMapMoveEnd, this._map))
                    },
                    _fireMapMoveEnd: function() {
                        _.Path._updateRequest = null,
                        this.fire("moveend")
                    },
                    _initElements: function() {
                        this._map._initPathRoot(),
                        this._ctx = this._map._canvasCtx
                    },
                    _updateStyle: function() {
                        var t = this.options;
                        t.stroke && (this._ctx.lineWidth = t.weight,
                        this._ctx.strokeStyle = t.color),
                        t.fill && (this._ctx.fillStyle = t.fillColor || t.color)
                    },
                    _drawPath: function() {
                        var t, e, i, n, o, s;
                        for (this._ctx.beginPath(),
                        t = 0,
                        i = this._parts.length; t < i; t++) {
                            for (e = 0,
                            n = this._parts[t].length; e < n; e++)
                                o = this._parts[t][e],
                                s = (0 === e ? "move" : "line") + "To",
                                this._ctx[s](o.x, o.y);
                            this instanceof _.Polygon && this._ctx.closePath()
                        }
                    },
                    _checkIfEmpty: function() {
                        return !this._parts.length
                    },
                    _updatePath: function() {
                        var t, e;
                        this._checkIfEmpty() || (t = this._ctx,
                        e = this.options,
                        this._drawPath(),
                        t.save(),
                        this._updateStyle(),
                        e.fill && (t.globalAlpha = e.fillOpacity,
                        t.fill()),
                        e.stroke && (t.globalAlpha = e.opacity,
                        t.stroke()),
                        t.restore())
                    },
                    _initEvents: function() {
                        this.options.clickable && (this._map.on("mousemove", this._onMouseMove, this),
                        this._map.on("click", this._onClick, this))
                    },
                    _onClick: function(t) {
                        this._containsPoint(t.layerPoint) && this.fire("click", t)
                    },
                    _onMouseMove: function(t) {
                        this._map && !this._map._animatingZoom && (this._containsPoint(t.layerPoint) ? (this._ctx.canvas.style.cursor = "pointer",
                        this._mouseInside = !0,
                        this.fire("mouseover", t)) : this._mouseInside && (this._ctx.canvas.style.cursor = "",
                        this._mouseInside = !1,
                        this.fire("mouseout", t)))
                    }
                }),
                _.Map.include(_.Path.SVG && !s.L_PREFER_CANVAS || !_.Browser.canvas ? {} : {
                    _initPathRoot: function() {
                        var t, e = this._pathRoot;
                        e || ((e = this._pathRoot = p.createElement("canvas")).style.position = "absolute",
                        (t = this._canvasCtx = e.getContext("2d")).lineCap = "round",
                        t.lineJoin = "round",
                        this._panes.overlayPane.appendChild(e),
                        this.options.zoomAnimation && (this._pathRoot.className = "leaflet-zoom-animated",
                        this.on("zoomanim", this._animatePathZoom),
                        this.on("zoomend", this._endPathZoom)),
                        this.on("moveend", this._updateCanvasViewport),
                        this._updateCanvasViewport())
                    },
                    _updateCanvasViewport: function() {
                        var t, e, i, n;
                        this._pathZooming || (this._updatePathViewport(),
                        e = (t = this._pathViewport).min,
                        i = t.max.subtract(e),
                        n = this._pathRoot,
                        _.DomUtil.setPosition(n, e),
                        n.width = i.x,
                        n.height = i.y,
                        n.getContext("2d").translate(-e.x, -e.y))
                    }
                }),
                _.LineUtil = {
                    simplify: function(t, e) {
                        if (!e || !t.length)
                            return t.slice();
                        var i = e * e;
                        return t = this._reducePoints(t, i),
                        t = this._simplifyDP(t, i)
                    },
                    pointToSegmentDistance: function(t, e, i) {
                        return Math.sqrt(this._sqClosestPointOnSegment(t, e, i, !0))
                    },
                    closestPointOnSegment: function(t, e, i) {
                        return this._sqClosestPointOnSegment(t, e, i)
                    },
                    _simplifyDP: function(t, e) {
                        var i = t.length
                          , n = new (("undefined" == typeof Uint8Array ? "undefined" : W(Uint8Array)) !== a + "" ? Uint8Array : Array)(i);
                        n[0] = n[i - 1] = 1,
                        this._simplifyDPStep(t, n, e, 0, i - 1);
                        for (var o = [], s = 0; s < i; s++)
                            n[s] && o.push(t[s]);
                        return o
                    },
                    _simplifyDPStep: function(t, e, i, n, o) {
                        for (var s, a, r = 0, h = n + 1; h <= o - 1; h++)
                            r < (a = this._sqClosestPointOnSegment(t[h], t[n], t[o], !0)) && (s = h,
                            r = a);
                        i < r && (e[s] = 1,
                        this._simplifyDPStep(t, e, i, n, s),
                        this._simplifyDPStep(t, e, i, s, o))
                    },
                    _reducePoints: function(t, e) {
                        for (var i = [t[0]], n = 1, o = 0, s = t.length; n < s; n++)
                            this._sqDist(t[n], t[o]) > e && (i.push(t[n]),
                            o = n);
                        return o < s - 1 && i.push(t[s - 1]),
                        i
                    },
                    clipSegment: function(t, e, i, n) {
                        var o, s, a, r = n ? this._lastCode : this._getBitCode(t, i), h = this._getBitCode(e, i);
                        for (this._lastCode = h; ; ) {
                            if (!(r | h))
                                return [t, e];
                            if (r & h)
                                return !1;
                            o = r || h,
                            s = this._getEdgeIntersection(t, e, o, i),
                            a = this._getBitCode(s, i),
                            o === r ? (t = s,
                            r = a) : (e = s,
                            h = a)
                        }
                    },
                    _getEdgeIntersection: function(t, e, i, n) {
                        var o = e.x - t.x
                          , s = e.y - t.y
                          , a = n.min
                          , r = n.max;
                        return 8 & i ? new _.Point(t.x + o * (r.y - t.y) / s,r.y) : 4 & i ? new _.Point(t.x + o * (a.y - t.y) / s,a.y) : 2 & i ? new _.Point(r.x,t.y + s * (r.x - t.x) / o) : 1 & i ? new _.Point(a.x,t.y + s * (a.x - t.x) / o) : void 0
                    },
                    _getBitCode: function(t, e) {
                        var i = 0;
                        return t.x < e.min.x ? i |= 1 : t.x > e.max.x && (i |= 2),
                        t.y < e.min.y ? i |= 4 : t.y > e.max.y && (i |= 8),
                        i
                    },
                    _sqDist: function(t, e) {
                        var i = e.x - t.x
                          , n = e.y - t.y;
                        return i * i + n * n
                    },
                    _sqClosestPointOnSegment: function(t, e, i, n) {
                        var o, s = e.x, a = e.y, r = i.x - s, h = i.y - a, l = r * r + h * h;
                        return 0 < l && (1 < (o = ((t.x - s) * r + (t.y - a) * h) / l) ? (s = i.x,
                        a = i.y) : 0 < o && (s += r * o,
                        a += h * o)),
                        r = t.x - s,
                        h = t.y - a,
                        n ? r * r + h * h : new _.Point(s,a)
                    }
                },
                _.Polyline = _.Path.extend({
                    initialize: function(t, e) {
                        _.Path.prototype.initialize.call(this, e),
                        this._latlngs = this._convertLatLngs(t)
                    },
                    options: {
                        smoothFactor: 1,
                        noClip: !1
                    },
                    projectLatlngs: function() {
                        this._originalPoints = [];
                        for (var t = 0, e = this._latlngs.length; t < e; t++)
                            this._originalPoints[t] = this._map.latLngToLayerPoint(this._latlngs[t])
                    },
                    getPathString: function() {
                        for (var t = 0, e = this._parts.length, i = ""; t < e; t++)
                            i += this._getPathPartStr(this._parts[t]);
                        return i
                    },
                    getLatLngs: function() {
                        return this._latlngs
                    },
                    setLatLngs: function(t) {
                        return this._latlngs = this._convertLatLngs(t),
                        this.redraw()
                    },
                    addLatLng: function(t) {
                        return this._latlngs.push(_.latLng(t)),
                        this.redraw()
                    },
                    spliceLatLngs: function() {
                        var t = [].splice.apply(this._latlngs, arguments);
                        return this._convertLatLngs(this._latlngs, !0),
                        this.redraw(),
                        t
                    },
                    closestLayerPoint: function(t) {
                        for (var e, i, n = 1 / 0, o = this._parts, s = null, a = 0, r = o.length; a < r; a++)
                            for (var h = o[a], l = 1, u = h.length; l < u; l++) {
                                e = h[l - 1],
                                i = h[l];
                                var c = _.LineUtil._sqClosestPointOnSegment(t, e, i, !0);
                                c < n && (n = c,
                                s = _.LineUtil._sqClosestPointOnSegment(t, e, i))
                            }
                        return s && (s.distance = Math.sqrt(n)),
                        s
                    },
                    getBounds: function() {
                        return new _.LatLngBounds(this.getLatLngs())
                    },
                    _convertLatLngs: function(t, e) {
                        for (var i = e ? t : [], n = 0, o = t.length; n < o; n++) {
                            if (_.Util.isArray(t[n]) && "number" != typeof t[n][0])
                                return;
                            i[n] = _.latLng(t[n])
                        }
                        return i
                    },
                    _initEvents: function() {
                        _.Path.prototype._initEvents.call(this)
                    },
                    _getPathPartStr: function(t) {
                        for (var e, i = _.Path.VML, n = 0, o = t.length, s = ""; n < o; n++)
                            e = t[n],
                            i && e._round(),
                            s += (n ? "L" : "M") + e.x + " " + e.y;
                        return s
                    },
                    _clipPoints: function() {
                        var t, e = this._originalPoints, i = e.length;
                        if (this.options.noClip)
                            this._parts = [e];
                        else {
                            this._parts = [];
                            for (var n = this._parts, o = this._map._pathViewport, s = _.LineUtil, a = 0, r = 0; a < i - 1; a++)
                                (t = s.clipSegment(e[a], e[a + 1], o, a)) && (n[r] = n[r] || [],
                                n[r].push(t[0]),
                                t[1] === e[a + 1] && a !== i - 2 || (n[r].push(t[1]),
                                r++))
                        }
                    },
                    _simplifyPoints: function() {
                        for (var t = this._parts, e = _.LineUtil, i = 0, n = t.length; i < n; i++)
                            t[i] = e.simplify(t[i], this.options.smoothFactor)
                    },
                    _updatePath: function() {
                        this._map && (this._clipPoints(),
                        this._simplifyPoints(),
                        _.Path.prototype._updatePath.call(this))
                    }
                }),
                _.polyline = function(t, e) {
                    return new _.Polyline(t,e)
                }
                ,
                _.PolyUtil = {},
                _.PolyUtil.clipPolygon = function(t, e) {
                    for (var i, n, o, s, a, r, h, l = [1, 4, 2, 8], u = _.LineUtil, c = 0, d = t.length; c < d; c++)
                        t[c]._code = u._getBitCode(t[c], e);
                    for (o = 0; o < 4; o++) {
                        for (r = l[o],
                        i = [],
                        c = 0,
                        n = (d = t.length) - 1; c < d; n = c++)
                            s = t[c],
                            a = t[n],
                            s._code & r ? a._code & r || ((h = u._getEdgeIntersection(a, s, r, e))._code = u._getBitCode(h, e),
                            i.push(h)) : (a._code & r && ((h = u._getEdgeIntersection(a, s, r, e))._code = u._getBitCode(h, e),
                            i.push(h)),
                            i.push(s));
                        t = i
                    }
                    return t
                }
                ,
                _.Polygon = _.Polyline.extend({
                    options: {
                        fill: !0
                    },
                    initialize: function(t, e) {
                        _.Polyline.prototype.initialize.call(this, t, e),
                        this._initWithHoles(t)
                    },
                    _initWithHoles: function(t) {
                        var e, i, n;
                        if (t && _.Util.isArray(t[0]) && "number" != typeof t[0][0])
                            for (this._latlngs = this._convertLatLngs(t[0]),
                            this._holes = t.slice(1),
                            e = 0,
                            i = this._holes.length; e < i; e++)
                                (n = this._holes[e] = this._convertLatLngs(this._holes[e]))[0].equals(n[n.length - 1]) && n.pop();
                        2 <= (t = this._latlngs).length && t[0].equals(t[t.length - 1]) && t.pop()
                    },
                    projectLatlngs: function() {
                        if (_.Polyline.prototype.projectLatlngs.call(this),
                        this._holePoints = [],
                        this._holes)
                            for (var t, e, i = 0, n = this._holes.length; i < n; i++)
                                for (this._holePoints[i] = [],
                                t = 0,
                                e = this._holes[i].length; t < e; t++)
                                    this._holePoints[i][t] = this._map.latLngToLayerPoint(this._holes[i][t])
                    },
                    setLatLngs: function(t) {
                        return t && _.Util.isArray(t[0]) && "number" != typeof t[0][0] ? (this._initWithHoles(t),
                        this.redraw()) : _.Polyline.prototype.setLatLngs.call(this, t)
                    },
                    _clipPoints: function() {
                        var t = this._originalPoints
                          , e = [];
                        if (this._parts = [t].concat(this._holePoints),
                        !this.options.noClip) {
                            for (var i = 0, n = this._parts.length; i < n; i++) {
                                var o = _.PolyUtil.clipPolygon(this._parts[i], this._map._pathViewport);
                                o.length && e.push(o)
                            }
                            this._parts = e
                        }
                    },
                    _getPathPartStr: function(t) {
                        return _.Polyline.prototype._getPathPartStr.call(this, t) + (_.Browser.svg ? "z" : "x")
                    }
                }),
                _.polygon = function(t, e) {
                    return new _.Polygon(t,e)
                }
                ,
                _.MultiPolyline = z(_.Polyline),
                _.MultiPolygon = z(_.Polygon),
                _.multiPolyline = function(t, e) {
                    return new _.MultiPolyline(t,e)
                }
                ,
                _.multiPolygon = function(t, e) {
                    return new _.MultiPolygon(t,e)
                }
                ,
                _.Rectangle = _.Polygon.extend({
                    initialize: function(t, e) {
                        _.Polygon.prototype.initialize.call(this, this._boundsToLatLngs(t), e)
                    },
                    setBounds: function(t) {
                        this.setLatLngs(this._boundsToLatLngs(t))
                    },
                    _boundsToLatLngs: function(t) {
                        return [(t = _.latLngBounds(t)).getSouthWest(), t.getNorthWest(), t.getNorthEast(), t.getSouthEast()]
                    }
                }),
                _.rectangle = function(t, e) {
                    return new _.Rectangle(t,e)
                }
                ,
                _.Circle = _.Path.extend({
                    initialize: function(t, e, i) {
                        _.Path.prototype.initialize.call(this, i),
                        this._latlng = _.latLng(t),
                        this._mRadius = e
                    },
                    options: {
                        fill: !0
                    },
                    setLatLng: function(t) {
                        return this._latlng = _.latLng(t),
                        this.redraw()
                    },
                    setRadius: function(t) {
                        return this._mRadius = t,
                        this.redraw()
                    },
                    projectLatlngs: function() {
                        var t = this._getLngRadius()
                          , e = this._latlng
                          , i = this._map.latLngToLayerPoint([e.lat, e.lng - t]);
                        this._point = this._map.latLngToLayerPoint(e),
                        this._radius = Math.max(this._point.x - i.x, 1)
                    },
                    getBounds: function() {
                        var t = this._getLngRadius()
                          , e = this._mRadius / 40075017 * 360
                          , i = this._latlng;
                        return new _.LatLngBounds([i.lat - e, i.lng - t],[i.lat + e, i.lng + t])
                    },
                    getLatLng: function() {
                        return this._latlng
                    },
                    getPathString: function() {
                        var t = this._point
                          , e = this._radius;
                        return this._checkIfEmpty() ? "" : _.Browser.svg ? "M" + t.x + "," + (t.y - e) + "A" + e + "," + e + ",0,1,1," + (t.x - .1) + "," + (t.y - e) + " z" : (t._round(),
                        e = Math.round(e),
                        "AL " + t.x + "," + t.y + " " + e + "," + e + " 0,23592600")
                    },
                    getRadius: function() {
                        return this._mRadius
                    },
                    _getLatRadius: function() {
                        return this._mRadius / 40075017 * 360
                    },
                    _getLngRadius: function() {
                        return this._getLatRadius() / Math.cos(_.LatLng.DEG_TO_RAD * this._latlng.lat)
                    },
                    _checkIfEmpty: function() {
                        if (!this._map)
                            return !1;
                        var t = this._map._pathViewport
                          , e = this._radius
                          , i = this._point;
                        return i.x - e > t.max.x || i.y - e > t.max.y || i.x + e < t.min.x || i.y + e < t.min.y
                    }
                }),
                _.circle = function(t, e, i) {
                    return new _.Circle(t,e,i)
                }
                ,
                _.CircleMarker = _.Circle.extend({
                    options: {
                        radius: 10,
                        weight: 2
                    },
                    initialize: function(t, e) {
                        _.Circle.prototype.initialize.call(this, t, null, e),
                        this._radius = this.options.radius
                    },
                    projectLatlngs: function() {
                        this._point = this._map.latLngToLayerPoint(this._latlng)
                    },
                    _updateStyle: function() {
                        _.Circle.prototype._updateStyle.call(this),
                        this.setRadius(this.options.radius)
                    },
                    setLatLng: function(t) {
                        return _.Circle.prototype.setLatLng.call(this, t),
                        this._popup && this._popup._isOpen && this._popup.setLatLng(t),
                        this
                    },
                    setRadius: function(t) {
                        return this.options.radius = this._radius = t,
                        this.redraw()
                    },
                    getRadius: function() {
                        return this._radius
                    }
                }),
                _.circleMarker = function(t, e) {
                    return new _.CircleMarker(t,e)
                }
                ,
                _.Polyline.include(_.Path.CANVAS ? {
                    _containsPoint: function(t, e) {
                        var i, n, o, s, a, r, h = this.options.weight / 2;
                        for (_.Browser.touch && (h += 10),
                        i = 0,
                        s = this._parts.length; i < s; i++)
                            for (n = 0,
                            o = (a = (r = this._parts[i]).length) - 1; n < a; o = n++)
                                if ((e || 0 !== n) && _.LineUtil.pointToSegmentDistance(t, r[o], r[n]) <= h)
                                    return !0;
                        return !1
                    }
                } : {}),
                _.Polygon.include(_.Path.CANVAS ? {
                    _containsPoint: function(t) {
                        var e, i, n, o, s, a, r, h, l = !1;
                        if (_.Polyline.prototype._containsPoint.call(this, t, !0))
                            return !0;
                        for (o = 0,
                        r = this._parts.length; o < r; o++)
                            for (s = 0,
                            a = (h = (e = this._parts[o]).length) - 1; s < h; a = s++)
                                i = e[s],
                                n = e[a],
                                i.y > t.y != n.y > t.y && t.x < (n.x - i.x) * (t.y - i.y) / (n.y - i.y) + i.x && (l = !l);
                        return l
                    }
                } : {}),
                _.Circle.include(_.Path.CANVAS ? {
                    _drawPath: function() {
                        var t = this._point;
                        this._ctx.beginPath(),
                        this._ctx.arc(t.x, t.y, this._radius, 0, 2 * Math.PI, !1)
                    },
                    _containsPoint: function(t) {
                        var e = this._point
                          , i = this.options.stroke ? this.options.weight / 2 : 0;
                        return t.distanceTo(e) <= this._radius + i
                    }
                } : {}),
                _.CircleMarker.include(_.Path.CANVAS ? {
                    _updateStyle: function() {
                        _.Path.prototype._updateStyle.call(this)
                    }
                } : {}),
                _.GeoJSON = _.FeatureGroup.extend({
                    initialize: function(t, e) {
                        _.setOptions(this, e),
                        this._layers = {},
                        t && this.addData(t)
                    },
                    addData: function(t) {
                        var e, i, n, o = _.Util.isArray(t) ? t : t.features;
                        if (o) {
                            for (e = 0,
                            i = o.length; e < i; e++)
                                ((n = o[e]).geometries || n.geometry || n.features || n.coordinates) && this.addData(o[e]);
                            return this
                        }
                        var s = this.options;
                        if (!s.filter || s.filter(t)) {
                            var a = _.GeoJSON.geometryToLayer(t, s.pointToLayer, s.coordsToLatLng, s);
                            return a.feature = _.GeoJSON.asFeature(t),
                            a.defaultOptions = a.options,
                            this.resetStyle(a),
                            s.onEachFeature && s.onEachFeature(t, a),
                            this.addLayer(a)
                        }
                    },
                    resetStyle: function(t) {
                        var e = this.options.style;
                        e && (_.Util.extend(t.options, t.defaultOptions),
                        this._setLayerStyle(t, e))
                    },
                    setStyle: function(e) {
                        this.eachLayer(function(t) {
                            this._setLayerStyle(t, e)
                        }, this)
                    },
                    _setLayerStyle: function(t, e) {
                        "function" == typeof e && (e = e(t.feature)),
                        t.setStyle && t.setStyle(e)
                    }
                }),
                _.extend(_.GeoJSON, {
                    geometryToLayer: function(t, e, i, n) {
                        var o, s, a, r, h = "Feature" === t.type ? t.geometry : t, l = h.coordinates, u = [];
                        switch (i = i || this.coordsToLatLng,
                        h.type) {
                        case "Point":
                            return o = i(l),
                            e ? e(t, o) : new _.Marker(o);
                        case "MultiPoint":
                            for (a = 0,
                            r = l.length; a < r; a++)
                                o = i(l[a]),
                                u.push(e ? e(t, o) : new _.Marker(o));
                            return new _.FeatureGroup(u);
                        case "LineString":
                            return s = this.coordsToLatLngs(l, 0, i),
                            new _.Polyline(s,n);
                        case "Polygon":
                            if (2 === l.length && !l[1].length)
                                throw new Error("Invalid GeoJSON object.");
                            return s = this.coordsToLatLngs(l, 1, i),
                            new _.Polygon(s,n);
                        case "MultiLineString":
                            return s = this.coordsToLatLngs(l, 1, i),
                            new _.MultiPolyline(s,n);
                        case "MultiPolygon":
                            return s = this.coordsToLatLngs(l, 2, i),
                            new _.MultiPolygon(s,n);
                        case "GeometryCollection":
                            for (a = 0,
                            r = h.geometries.length; a < r; a++)
                                u.push(this.geometryToLayer({
                                    geometry: h.geometries[a],
                                    type: "Feature",
                                    properties: t.properties
                                }, e, i, n));
                            return new _.FeatureGroup(u);
                        default:
                            throw new Error("Invalid GeoJSON object.")
                        }
                    },
                    coordsToLatLng: function(t) {
                        return new _.LatLng(t[1],t[0],t[2])
                    },
                    coordsToLatLngs: function(t, e, i) {
                        for (var n, o = [], s = 0, a = t.length; s < a; s++)
                            n = e ? this.coordsToLatLngs(t[s], e - 1, i) : (i || this.coordsToLatLng)(t[s]),
                            o.push(n);
                        return o
                    },
                    latLngToCoords: function(t) {
                        var e = [t.lng, t.lat];
                        return t.alt !== a && e.push(t.alt),
                        e
                    },
                    latLngsToCoords: function(t) {
                        for (var e = [], i = 0, n = t.length; i < n; i++)
                            e.push(_.GeoJSON.latLngToCoords(t[i]));
                        return e
                    },
                    getFeature: function(t, e) {
                        return t.feature ? _.extend({}, t.feature, {
                            geometry: e
                        }) : _.GeoJSON.asFeature(e)
                    },
                    asFeature: function(t) {
                        return "Feature" === t.type ? t : {
                            type: "Feature",
                            properties: {},
                            geometry: t
                        }
                    }
                });
                var N = {
                    toGeoJSON: function() {
                        return _.GeoJSON.getFeature(this, {
                            type: "Point",
                            coordinates: _.GeoJSON.latLngToCoords(this.getLatLng())
                        })
                    }
                };
                function R(t) {
                    return function() {
                        var e = [];
                        return this.eachLayer(function(t) {
                            e.push(t.toGeoJSON().geometry.coordinates)
                        }),
                        _.GeoJSON.getFeature(this, {
                            type: t,
                            coordinates: e
                        })
                    }
                }
                _.Marker.include(N),
                _.Circle.include(N),
                _.CircleMarker.include(N),
                _.Polyline.include({
                    toGeoJSON: function() {
                        return _.GeoJSON.getFeature(this, {
                            type: "LineString",
                            coordinates: _.GeoJSON.latLngsToCoords(this.getLatLngs())
                        })
                    }
                }),
                _.Polygon.include({
                    toGeoJSON: function() {
                        var t, e, i, n = [_.GeoJSON.latLngsToCoords(this.getLatLngs())];
                        if (n[0].push(n[0][0]),
                        this._holes)
                            for (t = 0,
                            e = this._holes.length; t < e; t++)
                                (i = _.GeoJSON.latLngsToCoords(this._holes[t])).push(i[0]),
                                n.push(i);
                        return _.GeoJSON.getFeature(this, {
                            type: "Polygon",
                            coordinates: n
                        })
                    }
                }),
                _.MultiPolyline.include({
                    toGeoJSON: R("MultiLineString")
                }),
                _.MultiPolygon.include({
                    toGeoJSON: R("MultiPolygon")
                }),
                _.LayerGroup.include({
                    toGeoJSON: function() {
                        var e, t = this.feature && this.feature.geometry, i = [];
                        if (t && "MultiPoint" === t.type)
                            return R("MultiPoint").call(this);
                        var n = t && "GeometryCollection" === t.type;
                        return this.eachLayer(function(t) {
                            t.toGeoJSON && (e = t.toGeoJSON(),
                            i.push(n ? e.geometry : _.GeoJSON.asFeature(e)))
                        }),
                        n ? _.GeoJSON.getFeature(this, {
                            geometries: i,
                            type: "GeometryCollection"
                        }) : {
                            type: "FeatureCollection",
                            features: i
                        }
                    }
                }),
                _.geoJson = function(t, e) {
                    return new _.GeoJSON(t,e)
                }
                ,
                _.DomEvent = {
                    addListener: function(e, t, i, n) {
                        var o, s, a, r = _.stamp(i), h = "_leaflet_" + t + r;
                        return e[h] ? this : (o = function(t) {
                            return i.call(n || e, t || _.DomEvent._getEvent())
                        }
                        ,
                        _.Browser.pointer && 0 === t.indexOf("touch") ? this.addPointerListener(e, t, o, r) : (_.Browser.touch && "dblclick" === t && this.addDoubleTapListener && this.addDoubleTapListener(e, o, r),
                        "addEventListener"in e ? "mousewheel" === t ? (e.addEventListener("DOMMouseScroll", o, !1),
                        e.addEventListener(t, o, !1)) : "mouseenter" === t || "mouseleave" === t ? (s = o,
                        a = "mouseenter" === t ? "mouseover" : "mouseout",
                        o = function(t) {
                            if (_.DomEvent._checkMouse(e, t))
                                return s(t)
                        }
                        ,
                        e.addEventListener(a, o, !1)) : ("click" === t && _.Browser.android && (s = o,
                        o = function(t) {
                            return _.DomEvent._filterClick(t, s)
                        }
                        ),
                        e.addEventListener(t, o, !1)) : "attachEvent"in e && e.attachEvent("on" + t, o),
                        e[h] = o,
                        this))
                    },
                    removeListener: function(t, e, i) {
                        var n = _.stamp(i)
                          , o = "_leaflet_" + e + n
                          , s = t[o];
                        return s && (_.Browser.pointer && 0 === e.indexOf("touch") ? this.removePointerListener(t, e, n) : _.Browser.touch && "dblclick" === e && this.removeDoubleTapListener ? this.removeDoubleTapListener(t, n) : "removeEventListener"in t ? "mousewheel" === e ? (t.removeEventListener("DOMMouseScroll", s, !1),
                        t.removeEventListener(e, s, !1)) : "mouseenter" === e || "mouseleave" === e ? t.removeEventListener("mouseenter" === e ? "mouseover" : "mouseout", s, !1) : t.removeEventListener(e, s, !1) : "detachEvent"in t && t.detachEvent("on" + e, s),
                        t[o] = null),
                        this
                    },
                    stopPropagation: function(t) {
                        return t.stopPropagation ? t.stopPropagation() : t.cancelBubble = !0,
                        _.DomEvent._skipped(t),
                        this
                    },
                    disableScrollPropagation: function(t) {
                        var e = _.DomEvent.stopPropagation;
                        return _.DomEvent.on(t, "mousewheel", e).on(t, "MozMousePixelScroll", e)
                    },
                    disableClickPropagation: function(t) {
                        for (var e = _.DomEvent.stopPropagation, i = _.Draggable.START.length - 1; 0 <= i; i--)
                            _.DomEvent.on(t, _.Draggable.START[i], e);
                        return _.DomEvent.on(t, "click", _.DomEvent._fakeStop).on(t, "dblclick", e)
                    },
                    preventDefault: function(t) {
                        return t.preventDefault ? t.preventDefault() : t.returnValue = !1,
                        this
                    },
                    stop: function(t) {
                        return _.DomEvent.preventDefault(t).stopPropagation(t)
                    },
                    getMousePosition: function(t, e) {
                        if (!e)
                            return new _.Point(t.clientX,t.clientY);
                        var i = e.getBoundingClientRect();
                        return new _.Point(t.clientX - i.left - e.clientLeft,t.clientY - i.top - e.clientTop)
                    },
                    getWheelDelta: function(t) {
                        var e = 0;
                        return t.wheelDelta && (e = t.wheelDelta / 120),
                        t.detail && (e = -t.detail / 3),
                        e
                    },
                    _skipEvents: {},
                    _fakeStop: function(t) {
                        _.DomEvent._skipEvents[t.type] = !0
                    },
                    _skipped: function(t) {
                        var e = this._skipEvents[t.type];
                        return this._skipEvents[t.type] = !1,
                        e
                    },
                    _checkMouse: function(t, e) {
                        var i = e.relatedTarget;
                        if (!i)
                            return !0;
                        try {
                            for (; i && i !== t; )
                                i = i.parentNode
                        } catch (t) {
                            return !1
                        }
                        return i !== t
                    },
                    _getEvent: function() {
                        var t = s.event;
                        if (!t)
                            for (var e = arguments.callee.caller; e && (!(t = e.arguments[0]) || s.Event !== t.constructor); )
                                e = e.caller;
                        return t
                    },
                    _filterClick: function(t, e) {
                        var i = t.timeStamp || t.originalEvent.timeStamp
                          , n = _.DomEvent._lastClick && i - _.DomEvent._lastClick;
                        if (!(n && 100 < n && n < 500 || t.target._simulatedClick && !t._simulated))
                            return _.DomEvent._lastClick = i,
                            e(t);
                        _.DomEvent.stop(t)
                    }
                },
                _.DomEvent.on = _.DomEvent.addListener,
                _.DomEvent.off = _.DomEvent.removeListener,
                _.Draggable = _.Class.extend({
                    includes: _.Mixin.Events,
                    statics: {
                        START: _.Browser.touch ? ["touchstart", "mousedown"] : ["mousedown"],
                        END: {
                            mousedown: "mouseup",
                            touchstart: "touchend",
                            pointerdown: "touchend",
                            MSPointerDown: "touchend"
                        },
                        MOVE: {
                            mousedown: "mousemove",
                            touchstart: "touchmove",
                            pointerdown: "touchmove",
                            MSPointerDown: "touchmove"
                        }
                    },
                    initialize: function(t, e) {
                        this._element = t,
                        this._dragStartTarget = e || t
                    },
                    enable: function() {
                        if (!this._enabled) {
                            for (var t = _.Draggable.START.length - 1; 0 <= t; t--)
                                _.DomEvent.on(this._dragStartTarget, _.Draggable.START[t], this._onDown, this);
                            this._enabled = !0
                        }
                    },
                    disable: function() {
                        if (this._enabled) {
                            for (var t = _.Draggable.START.length - 1; 0 <= t; t--)
                                _.DomEvent.off(this._dragStartTarget, _.Draggable.START[t], this._onDown, this);
                            this._enabled = !1,
                            this._moved = !1
                        }
                    },
                    _onDown: function(t) {
                        var e;
                        this._moved = !1,
                        t.shiftKey || 1 !== t.which && 1 !== t.button && !t.touches || (_.DomEvent.stopPropagation(t),
                        _.Draggable._disabled || (_.DomUtil.disableImageDrag(),
                        _.DomUtil.disableTextSelection(),
                        this._moving || (e = t.touches ? t.touches[0] : t,
                        this._startPoint = new _.Point(e.clientX,e.clientY),
                        this._startPos = this._newPos = _.DomUtil.getPosition(this._element),
                        _.DomEvent.on(p, _.Draggable.MOVE[t.type], this._onMove, this).on(p, _.Draggable.END[t.type], this._onUp, this))))
                    },
                    _onMove: function(t) {
                        var e, i;
                        t.touches && 1 < t.touches.length ? this._moved = !0 : (e = t.touches && 1 === t.touches.length ? t.touches[0] : t,
                        ((i = new _.Point(e.clientX,e.clientY).subtract(this._startPoint)).x || i.y) && (_.Browser.touch && Math.abs(i.x) + Math.abs(i.y) < 3 || (_.DomEvent.preventDefault(t),
                        this._moved || (this.fire("dragstart"),
                        this._moved = !0,
                        this._startPos = _.DomUtil.getPosition(this._element).subtract(i),
                        _.DomUtil.addClass(p.body, "leaflet-dragging"),
                        this._lastTarget = t.target || t.srcElement,
                        _.DomUtil.addClass(this._lastTarget, "leaflet-drag-target")),
                        this._newPos = this._startPos.add(i),
                        this._moving = !0,
                        _.Util.cancelAnimFrame(this._animRequest),
                        this._animRequest = _.Util.requestAnimFrame(this._updatePosition, this, !0, this._dragStartTarget))))
                    },
                    _updatePosition: function() {
                        this.fire("predrag"),
                        _.DomUtil.setPosition(this._element, this._newPos),
                        this.fire("drag")
                    },
                    _onUp: function() {
                        for (var t in _.DomUtil.removeClass(p.body, "leaflet-dragging"),
                        this._lastTarget && (_.DomUtil.removeClass(this._lastTarget, "leaflet-drag-target"),
                        this._lastTarget = null),
                        _.Draggable.MOVE)
                            _.DomEvent.off(p, _.Draggable.MOVE[t], this._onMove).off(p, _.Draggable.END[t], this._onUp);
                        _.DomUtil.enableImageDrag(),
                        _.DomUtil.enableTextSelection(),
                        this._moved && this._moving && (_.Util.cancelAnimFrame(this._animRequest),
                        this.fire("dragend", {
                            distance: this._newPos.distanceTo(this._startPos)
                        })),
                        this._moving = !1
                    }
                }),
                _.Handler = _.Class.extend({
                    initialize: function(t) {
                        this._map = t
                    },
                    enable: function() {
                        this._enabled || (this._enabled = !0,
                        this.addHooks())
                    },
                    disable: function() {
                        this._enabled && (this._enabled = !1,
                        this.removeHooks())
                    },
                    enabled: function() {
                        return !!this._enabled
                    }
                }),
                _.Map.mergeOptions({
                    dragging: !0,
                    inertia: !_.Browser.android23,
                    inertiaDeceleration: 3400,
                    inertiaMaxSpeed: 1 / 0,
                    inertiaThreshold: _.Browser.touch ? 32 : 18,
                    easeLinearity: .25,
                    worldCopyJump: !1
                }),
                _.Map.Drag = _.Handler.extend({
                    addHooks: function() {
                        var t;
                        this._draggable || (t = this._map,
                        this._draggable = new _.Draggable(t._mapPane,t._container),
                        this._draggable.on({
                            dragstart: this._onDragStart,
                            drag: this._onDrag,
                            dragend: this._onDragEnd
                        }, this),
                        t.options.worldCopyJump && (this._draggable.on("predrag", this._onPreDrag, this),
                        t.on("viewreset", this._onViewReset, this),
                        t.whenReady(this._onViewReset, this))),
                        this._draggable.enable()
                    },
                    removeHooks: function() {
                        this._draggable.disable()
                    },
                    moved: function() {
                        return this._draggable && this._draggable._moved
                    },
                    _onDragStart: function() {
                        var t = this._map;
                        t._panAnim && t._panAnim.stop(),
                        t.fire("movestart").fire("dragstart"),
                        t.options.inertia && (this._positions = [],
                        this._times = [])
                    },
                    _onDrag: function() {
                        var t, e;
                        this._map.options.inertia && (t = this._lastTime = +new Date,
                        e = this._lastPos = this._draggable._newPos,
                        this._positions.push(e),
                        this._times.push(t),
                        200 < t - this._times[0] && (this._positions.shift(),
                        this._times.shift())),
                        this._map.fire("move").fire("drag")
                    },
                    _onViewReset: function() {
                        var t = this._map.getSize()._divideBy(2)
                          , e = this._map.latLngToLayerPoint([0, 0]);
                        this._initialWorldOffset = e.subtract(t).x,
                        this._worldWidth = this._map.project([0, 180]).x
                    },
                    _onPreDrag: function() {
                        var t = this._worldWidth
                          , e = Math.round(t / 2)
                          , i = this._initialWorldOffset
                          , n = this._draggable._newPos.x
                          , o = (n - e + i) % t + e - i
                          , s = (n + e + i) % t - e - i
                          , a = Math.abs(o + i) < Math.abs(s + i) ? o : s;
                        this._draggable._newPos.x = a
                    },
                    _onDragEnd: function(t) {
                        var e, i, n, o, s, a, r, h, l, u = this._map, c = u.options, d = new Date - this._lastTime, p = !c.inertia || d > c.inertiaThreshold || !this._positions[0];
                        u.fire("dragend", t),
                        p ? u.fire("moveend") : (e = this._lastPos.subtract(this._positions[0]),
                        i = (this._lastTime + d - this._times[0]) / 1e3,
                        n = c.easeLinearity,
                        s = (o = e.multiplyBy(n / i)).distanceTo([0, 0]),
                        a = Math.min(c.inertiaMaxSpeed, s),
                        r = o.multiplyBy(a / s),
                        h = a / (c.inertiaDeceleration * n),
                        (l = r.multiplyBy(-h / 2).round()).x && l.y ? (l = u._limitOffset(l, u.options.maxBounds),
                        _.Util.requestAnimFrame(function() {
                            u.panBy(l, {
                                duration: h,
                                easeLinearity: n,
                                noMoveStart: !0
                            })
                        })) : u.fire("moveend"))
                    }
                }),
                _.Map.addInitHook("addHandler", "dragging", _.Map.Drag),
                _.Map.mergeOptions({
                    doubleClickZoom: !0
                }),
                _.Map.DoubleClickZoom = _.Handler.extend({
                    addHooks: function() {
                        this._map.on("dblclick", this._onDoubleClick, this)
                    },
                    removeHooks: function() {
                        this._map.off("dblclick", this._onDoubleClick, this)
                    },
                    _onDoubleClick: function(t) {
                        var e = this._map
                          , i = e.getZoom() + (t.originalEvent.shiftKey ? -1 : 1);
                        "center" === e.options.doubleClickZoom ? e.setZoom(i) : e.setZoomAround(t.containerPoint, i)
                    }
                }),
                _.Map.addInitHook("addHandler", "doubleClickZoom", _.Map.DoubleClickZoom),
                _.Map.mergeOptions({
                    scrollWheelZoom: !0
                }),
                _.Map.ScrollWheelZoom = _.Handler.extend({
                    addHooks: function() {
                        _.DomEvent.on(this._map._container, "mousewheel", this._onWheelScroll, this),
                        _.DomEvent.on(this._map._container, "MozMousePixelScroll", _.DomEvent.preventDefault),
                        this._delta = 0
                    },
                    removeHooks: function() {
                        _.DomEvent.off(this._map._container, "mousewheel", this._onWheelScroll),
                        _.DomEvent.off(this._map._container, "MozMousePixelScroll", _.DomEvent.preventDefault)
                    },
                    _onWheelScroll: function(t) {
                        var e = _.DomEvent.getWheelDelta(t);
                        this._delta += e,
                        this._lastMousePos = this._map.mouseEventToContainerPoint(t),
                        this._startTime || (this._startTime = +new Date);
                        var i = Math.max(40 - (new Date - this._startTime), 0);
                        clearTimeout(this._timer),
                        this._timer = setTimeout(_.bind(this._performZoom, this), i),
                        _.DomEvent.preventDefault(t),
                        _.DomEvent.stopPropagation(t)
                    },
                    _performZoom: function() {
                        var t = this._map
                          , e = this._delta
                          , i = t.getZoom()
                          , e = 0 < e ? Math.ceil(e) : Math.floor(e);
                        e = Math.max(Math.min(e, 4), -4),
                        e = t._limitZoom(i + e) - i,
                        this._delta = 0,
                        this._startTime = null,
                        e && ("center" === t.options.scrollWheelZoom ? t.setZoom(i + e) : t.setZoomAround(this._lastMousePos, i + e))
                    }
                }),
                _.Map.addInitHook("addHandler", "scrollWheelZoom", _.Map.ScrollWheelZoom),
                _.extend(_.DomEvent, {
                    _touchstart: _.Browser.msPointer ? "MSPointerDown" : _.Browser.pointer ? "pointerdown" : "touchstart",
                    _touchend: _.Browser.msPointer ? "MSPointerUp" : _.Browser.pointer ? "pointerup" : "touchend",
                    addDoubleTapListener: function(t, s, e) {
                        var a, r, h = !1, i = "_leaflet_", n = this._touchstart, o = this._touchend, l = [];
                        function u(t) {
                            var e, i, n = _.Browser.pointer ? (l.push(t.pointerId),
                            l.length) : t.touches.length;
                            1 < n || (i = (e = Date.now()) - (a || e),
                            r = t.touches ? t.touches[0] : t,
                            h = 0 < i && i <= 250,
                            a = e)
                        }
                        function c(t) {
                            if (_.Browser.pointer) {
                                var e = l.indexOf(t.pointerId);
                                if (-1 === e)
                                    return;
                                l.splice(e, 1)
                            }
                            if (h) {
                                if (_.Browser.pointer) {
                                    var i, n = {};
                                    for (var o in r)
                                        i = r[o],
                                        n[o] = "function" == typeof i ? i.bind(r) : i;
                                    r = n
                                }
                                r.type = "dblclick",
                                s(r),
                                a = null
                            }
                        }
                        t[i + n + e] = u,
                        t[i + o + e] = c;
                        var d = _.Browser.pointer ? p.documentElement : t;
                        return t.addEventListener(n, u, !1),
                        d.addEventListener(o, c, !1),
                        _.Browser.pointer && d.addEventListener(_.DomEvent.POINTER_CANCEL, c, !1),
                        this
                    },
                    removeDoubleTapListener: function(t, e) {
                        var i = "_leaflet_";
                        return t.removeEventListener(this._touchstart, t[i + this._touchstart + e], !1),
                        (_.Browser.pointer ? p.documentElement : t).removeEventListener(this._touchend, t[i + this._touchend + e], !1),
                        _.Browser.pointer && p.documentElement.removeEventListener(_.DomEvent.POINTER_CANCEL, t[i + this._touchend + e], !1),
                        this
                    }
                }),
                _.extend(_.DomEvent, {
                    POINTER_DOWN: _.Browser.msPointer ? "MSPointerDown" : "pointerdown",
                    POINTER_MOVE: _.Browser.msPointer ? "MSPointerMove" : "pointermove",
                    POINTER_UP: _.Browser.msPointer ? "MSPointerUp" : "pointerup",
                    POINTER_CANCEL: _.Browser.msPointer ? "MSPointerCancel" : "pointercancel",
                    _pointers: [],
                    _pointerDocumentListener: !1,
                    addPointerListener: function(t, e, i, n) {
                        switch (e) {
                        case "touchstart":
                            return this.addPointerListenerStart(t, e, i, n);
                        case "touchend":
                            return this.addPointerListenerEnd(t, e, i, n);
                        case "touchmove":
                            return this.addPointerListenerMove(t, e, i, n);
                        default:
                            throw "Unknown touch event type"
                        }
                    },
                    addPointerListenerStart: function(t, e, n, i) {
                        function o(t) {
                            _.DomEvent.preventDefault(t);
                            for (var e = !1, i = 0; i < a.length; i++)
                                if (a[i].pointerId === t.pointerId) {
                                    e = !0;
                                    break
                                }
                            e || a.push(t),
                            t.touches = a.slice(),
                            t.changedTouches = [t],
                            n(t)
                        }
                        var s, a = this._pointers;
                        return t["_leaflet_touchstart" + i] = o,
                        t.addEventListener(this.POINTER_DOWN, o, !1),
                        this._pointerDocumentListener || (s = function(t) {
                            for (var e = 0; e < a.length; e++)
                                if (a[e].pointerId === t.pointerId) {
                                    a.splice(e, 1);
                                    break
                                }
                        }
                        ,
                        p.documentElement.addEventListener(this.POINTER_UP, s, !1),
                        p.documentElement.addEventListener(this.POINTER_CANCEL, s, !1),
                        this._pointerDocumentListener = !0),
                        this
                    },
                    addPointerListenerMove: function(t, e, i, n) {
                        var o = this._pointers;
                        function s(t) {
                            if (t.pointerType !== t.MSPOINTER_TYPE_MOUSE && "mouse" !== t.pointerType || 0 !== t.buttons) {
                                for (var e = 0; e < o.length; e++)
                                    if (o[e].pointerId === t.pointerId) {
                                        o[e] = t;
                                        break
                                    }
                                t.touches = o.slice(),
                                t.changedTouches = [t],
                                i(t)
                            }
                        }
                        return t["_leaflet_touchmove" + n] = s,
                        t.addEventListener(this.POINTER_MOVE, s, !1),
                        this
                    },
                    addPointerListenerEnd: function(t, e, i, n) {
                        function o(t) {
                            for (var e = 0; e < s.length; e++)
                                if (s[e].pointerId === t.pointerId) {
                                    s.splice(e, 1);
                                    break
                                }
                            t.touches = s.slice(),
                            t.changedTouches = [t],
                            i(t)
                        }
                        var s = this._pointers;
                        return t["_leaflet_touchend" + n] = o,
                        t.addEventListener(this.POINTER_UP, o, !1),
                        t.addEventListener(this.POINTER_CANCEL, o, !1),
                        this
                    },
                    removePointerListener: function(t, e, i) {
                        var n = t["_leaflet_" + e + i];
                        switch (e) {
                        case "touchstart":
                            t.removeEventListener(this.POINTER_DOWN, n, !1);
                            break;
                        case "touchmove":
                            t.removeEventListener(this.POINTER_MOVE, n, !1);
                            break;
                        case "touchend":
                            t.removeEventListener(this.POINTER_UP, n, !1),
                            t.removeEventListener(this.POINTER_CANCEL, n, !1)
                        }
                        return this
                    }
                }),
                _.Map.mergeOptions({
                    touchZoom: _.Browser.touch && !_.Browser.android23,
                    bounceAtZoomLimits: !0
                }),
                _.Map.TouchZoom = _.Handler.extend({
                    addHooks: function() {
                        _.DomEvent.on(this._map._container, "touchstart", this._onTouchStart, this)
                    },
                    removeHooks: function() {
                        _.DomEvent.off(this._map._container, "touchstart", this._onTouchStart, this)
                    },
                    _onTouchStart: function(t) {
                        var e, i, n, o = this._map;
                        !t.touches || 2 !== t.touches.length || o._animatingZoom || this._zooming || (e = o.mouseEventToLayerPoint(t.touches[0]),
                        i = o.mouseEventToLayerPoint(t.touches[1]),
                        n = o._getCenterLayerPoint(),
                        this._startCenter = e.add(i)._divideBy(2),
                        this._startDist = e.distanceTo(i),
                        this._moved = !1,
                        this._zooming = !0,
                        this._centerOffset = n.subtract(this._startCenter),
                        o._panAnim && o._panAnim.stop(),
                        _.DomEvent.on(p, "touchmove", this._onTouchMove, this).on(p, "touchend", this._onTouchEnd, this),
                        _.DomEvent.preventDefault(t))
                    },
                    _onTouchMove: function(t) {
                        var e, i, n = this._map;
                        t.touches && 2 === t.touches.length && this._zooming && (e = n.mouseEventToLayerPoint(t.touches[0]),
                        i = n.mouseEventToLayerPoint(t.touches[1]),
                        this._scale = e.distanceTo(i) / this._startDist,
                        this._delta = e._add(i)._divideBy(2)._subtract(this._startCenter),
                        1 !== this._scale && (!n.options.bounceAtZoomLimits && (n.getZoom() === n.getMinZoom() && this._scale < 1 || n.getZoom() === n.getMaxZoom() && 1 < this._scale) || (this._moved || (_.DomUtil.addClass(n._mapPane, "leaflet-touching"),
                        n.fire("movestart").fire("zoomstart"),
                        this._moved = !0),
                        _.Util.cancelAnimFrame(this._animRequest),
                        this._animRequest = _.Util.requestAnimFrame(this._updateOnMove, this, !0, this._map._container),
                        _.DomEvent.preventDefault(t))))
                    },
                    _updateOnMove: function() {
                        var t = this._map
                          , e = this._getScaleOrigin()
                          , i = t.layerPointToLatLng(e)
                          , n = t.getScaleZoom(this._scale);
                        t._animateZoom(i, n, this._startCenter, this._scale, this._delta, !1, !0)
                    },
                    _onTouchEnd: function() {
                        var t, e, i, n, o, s, a, r;
                        this._moved && this._zooming ? (t = this._map,
                        this._zooming = !1,
                        _.DomUtil.removeClass(t._mapPane, "leaflet-touching"),
                        _.Util.cancelAnimFrame(this._animRequest),
                        _.DomEvent.off(p, "touchmove", this._onTouchMove).off(p, "touchend", this._onTouchEnd),
                        e = this._getScaleOrigin(),
                        i = t.layerPointToLatLng(e),
                        n = t.getZoom(),
                        s = 0 < (o = t.getScaleZoom(this._scale) - n) ? Math.ceil(o) : Math.floor(o),
                        a = t._limitZoom(n + s),
                        r = t.getZoomScale(a) / this._scale,
                        t._animateZoom(i, a, e, r)) : this._zooming = !1
                    },
                    _getScaleOrigin: function() {
                        var t = this._centerOffset.subtract(this._delta).divideBy(this._scale);
                        return this._startCenter.add(t)
                    }
                }),
                _.Map.addInitHook("addHandler", "touchZoom", _.Map.TouchZoom),
                _.Map.mergeOptions({
                    tap: !0,
                    tapTolerance: 15
                }),
                _.Map.Tap = _.Handler.extend({
                    addHooks: function() {
                        _.DomEvent.on(this._map._container, "touchstart", this._onDown, this)
                    },
                    removeHooks: function() {
                        _.DomEvent.off(this._map._container, "touchstart", this._onDown, this)
                    },
                    _onDown: function(t) {
                        if (t.touches) {
                            if (_.DomEvent.preventDefault(t),
                            this._fireClick = !0,
                            1 < t.touches.length)
                                return this._fireClick = !1,
                                void clearTimeout(this._holdTimeout);
                            var e = t.touches[0]
                              , i = e.target;
                            this._startPos = this._newPos = new _.Point(e.clientX,e.clientY),
                            i.tagName && "a" === i.tagName.toLowerCase() && _.DomUtil.addClass(i, "leaflet-active"),
                            this._holdTimeout = setTimeout(_.bind(function() {
                                this._isTapValid() && (this._fireClick = !1,
                                this._onUp(),
                                this._simulateEvent("contextmenu", e))
                            }, this), 1e3),
                            _.DomEvent.on(p, "touchmove", this._onMove, this).on(p, "touchend", this._onUp, this)
                        }
                    },
                    _onUp: function(t) {
                        var e, i;
                        clearTimeout(this._holdTimeout),
                        _.DomEvent.off(p, "touchmove", this._onMove, this).off(p, "touchend", this._onUp, this),
                        this._fireClick && t && t.changedTouches && ((i = (e = t.changedTouches[0]).target) && i.tagName && "a" === i.tagName.toLowerCase() && _.DomUtil.removeClass(i, "leaflet-active"),
                        this._isTapValid() && this._simulateEvent("click", e))
                    },
                    _isTapValid: function() {
                        return this._newPos.distanceTo(this._startPos) <= this._map.options.tapTolerance
                    },
                    _onMove: function(t) {
                        var e = t.touches[0];
                        this._newPos = new _.Point(e.clientX,e.clientY)
                    },
                    _simulateEvent: function(t, e) {
                        var i = p.createEvent("MouseEvents");
                        i._simulated = !0,
                        e.target._simulatedClick = !0,
                        i.initMouseEvent(t, !0, !0, s, 1, e.screenX, e.screenY, e.clientX, e.clientY, !1, !1, !1, !1, 0, null),
                        e.target.dispatchEvent(i)
                    }
                }),
                _.Browser.touch && !_.Browser.pointer && _.Map.addInitHook("addHandler", "tap", _.Map.Tap),
                _.Map.mergeOptions({
                    boxZoom: !0
                }),
                _.Map.BoxZoom = _.Handler.extend({
                    initialize: function(t) {
                        this._map = t,
                        this._container = t._container,
                        this._pane = t._panes.overlayPane,
                        this._moved = !1
                    },
                    addHooks: function() {
                        _.DomEvent.on(this._container, "mousedown", this._onMouseDown, this)
                    },
                    removeHooks: function() {
                        _.DomEvent.off(this._container, "mousedown", this._onMouseDown),
                        this._moved = !1
                    },
                    moved: function() {
                        return this._moved
                    },
                    _onMouseDown: function(t) {
                        if (this._moved = !1,
                        !t.shiftKey || 1 !== t.which && 1 !== t.button)
                            return !1;
                        _.DomUtil.disableTextSelection(),
                        _.DomUtil.disableImageDrag(),
                        this._startLayerPoint = this._map.mouseEventToLayerPoint(t),
                        _.DomEvent.on(p, "mousemove", this._onMouseMove, this).on(p, "mouseup", this._onMouseUp, this).on(p, "keydown", this._onKeyDown, this)
                    },
                    _onMouseMove: function(t) {
                        this._moved || (this._box = _.DomUtil.create("div", "leaflet-zoom-box", this._pane),
                        _.DomUtil.setPosition(this._box, this._startLayerPoint),
                        this._container.style.cursor = "crosshair",
                        this._map.fire("boxzoomstart"));
                        var e = this._startLayerPoint
                          , i = this._box
                          , n = this._map.mouseEventToLayerPoint(t)
                          , o = n.subtract(e)
                          , s = new _.Point(Math.min(n.x, e.x),Math.min(n.y, e.y));
                        _.DomUtil.setPosition(i, s),
                        this._moved = !0,
                        i.style.width = Math.max(0, Math.abs(o.x) - 4) + "px",
                        i.style.height = Math.max(0, Math.abs(o.y) - 4) + "px"
                    },
                    _finish: function() {
                        this._moved && (this._pane.removeChild(this._box),
                        this._container.style.cursor = ""),
                        _.DomUtil.enableTextSelection(),
                        _.DomUtil.enableImageDrag(),
                        _.DomEvent.off(p, "mousemove", this._onMouseMove).off(p, "mouseup", this._onMouseUp).off(p, "keydown", this._onKeyDown)
                    },
                    _onMouseUp: function(t) {
                        this._finish();
                        var e, i = this._map, n = i.mouseEventToLayerPoint(t);
                        this._startLayerPoint.equals(n) || (e = new _.LatLngBounds(i.layerPointToLatLng(this._startLayerPoint),i.layerPointToLatLng(n)),
                        i.fitBounds(e),
                        i.fire("boxzoomend", {
                            boxZoomBounds: e
                        }))
                    },
                    _onKeyDown: function(t) {
                        27 === t.keyCode && this._finish()
                    }
                }),
                _.Map.addInitHook("addHandler", "boxZoom", _.Map.BoxZoom),
                _.Map.mergeOptions({
                    keyboard: !0,
                    keyboardPanOffset: 80,
                    keyboardZoomOffset: 1
                }),
                _.Map.Keyboard = _.Handler.extend({
                    keyCodes: {
                        left: [37],
                        right: [39],
                        down: [40],
                        up: [38],
                        zoomIn: [187, 107, 61, 171],
                        zoomOut: [189, 109, 173]
                    },
                    initialize: function(t) {
                        this._map = t,
                        this._setPanOffset(t.options.keyboardPanOffset),
                        this._setZoomOffset(t.options.keyboardZoomOffset)
                    },
                    addHooks: function() {
                        var t = this._map._container;
                        -1 === t.tabIndex && (t.tabIndex = "0"),
                        _.DomEvent.on(t, "focus", this._onFocus, this).on(t, "blur", this._onBlur, this).on(t, "mousedown", this._onMouseDown, this),
                        this._map.on("focus", this._addHooks, this).on("blur", this._removeHooks, this)
                    },
                    removeHooks: function() {
                        this._removeHooks();
                        var t = this._map._container;
                        _.DomEvent.off(t, "focus", this._onFocus, this).off(t, "blur", this._onBlur, this).off(t, "mousedown", this._onMouseDown, this),
                        this._map.off("focus", this._addHooks, this).off("blur", this._removeHooks, this)
                    },
                    _onMouseDown: function() {
                        var t, e, i, n;
                        this._focused || (t = p.body,
                        e = p.documentElement,
                        i = t.scrollTop || e.scrollTop,
                        n = t.scrollLeft || e.scrollLeft,
                        this._map._container.focus(),
                        s.scrollTo(n, i))
                    },
                    _onFocus: function() {
                        this._focused = !0,
                        this._map.fire("focus")
                    },
                    _onBlur: function() {
                        this._focused = !1,
                        this._map.fire("blur")
                    },
                    _setPanOffset: function(t) {
                        for (var e = this._panKeys = {}, i = this.keyCodes, n = 0, o = i.left.length; n < o; n++)
                            e[i.left[n]] = [-1 * t, 0];
                        for (n = 0,
                        o = i.right.length; n < o; n++)
                            e[i.right[n]] = [t, 0];
                        for (n = 0,
                        o = i.down.length; n < o; n++)
                            e[i.down[n]] = [0, t];
                        for (n = 0,
                        o = i.up.length; n < o; n++)
                            e[i.up[n]] = [0, -1 * t]
                    },
                    _setZoomOffset: function(t) {
                        for (var e = this._zoomKeys = {}, i = this.keyCodes, n = 0, o = i.zoomIn.length; n < o; n++)
                            e[i.zoomIn[n]] = t;
                        for (n = 0,
                        o = i.zoomOut.length; n < o; n++)
                            e[i.zoomOut[n]] = -t
                    },
                    _addHooks: function() {
                        _.DomEvent.on(p, "keydown", this._onKeyDown, this)
                    },
                    _removeHooks: function() {
                        _.DomEvent.off(p, "keydown", this._onKeyDown, this)
                    },
                    _onKeyDown: function(t) {
                        var e = t.keyCode
                          , i = this._map;
                        if (e in this._panKeys) {
                            if (i._panAnim && i._panAnim._inProgress)
                                return;
                            i.panBy(this._panKeys[e]),
                            i.options.maxBounds && i.panInsideBounds(i.options.maxBounds)
                        } else {
                            if (!(e in this._zoomKeys))
                                return;
                            i.setZoom(i.getZoom() + this._zoomKeys[e])
                        }
                        _.DomEvent.stop(t)
                    }
                }),
                _.Map.addInitHook("addHandler", "keyboard", _.Map.Keyboard),
                _.Handler.MarkerDrag = _.Handler.extend({
                    initialize: function(t) {
                        this._marker = t
                    },
                    addHooks: function() {
                        var t = this._marker._icon;
                        this._draggable || (this._draggable = new _.Draggable(t,t)),
                        this._draggable.on("dragstart", this._onDragStart, this).on("drag", this._onDrag, this).on("dragend", this._onDragEnd, this),
                        this._draggable.enable(),
                        _.DomUtil.addClass(this._marker._icon, "leaflet-marker-draggable")
                    },
                    removeHooks: function() {
                        this._draggable.off("dragstart", this._onDragStart, this).off("drag", this._onDrag, this).off("dragend", this._onDragEnd, this),
                        this._draggable.disable(),
                        _.DomUtil.removeClass(this._marker._icon, "leaflet-marker-draggable")
                    },
                    moved: function() {
                        return this._draggable && this._draggable._moved
                    },
                    _onDragStart: function() {
                        this._marker.closePopup().fire("movestart").fire("dragstart")
                    },
                    _onDrag: function() {
                        var t = this._marker
                          , e = t._shadow
                          , i = _.DomUtil.getPosition(t._icon)
                          , n = t._map.layerPointToLatLng(i);
                        e && _.DomUtil.setPosition(e, i),
                        t._latlng = n,
                        t.fire("move", {
                            latlng: n
                        }).fire("drag")
                    },
                    _onDragEnd: function(t) {
                        this._marker.fire("moveend").fire("dragend", t)
                    }
                }),
                _.Control = _.Class.extend({
                    options: {
                        position: "topright"
                    },
                    initialize: function(t) {
                        _.setOptions(this, t)
                    },
                    getPosition: function() {
                        return this.options.position
                    },
                    setPosition: function(t) {
                        var e = this._map;
                        return e && e.removeControl(this),
                        this.options.position = t,
                        e && e.addControl(this),
                        this
                    },
                    getContainer: function() {
                        return this._container
                    },
                    addTo: function(t) {
                        this._map = t;
                        var e = this._container = this.onAdd(t)
                          , i = this.getPosition()
                          , n = t._controlCorners[i];
                        return _.DomUtil.addClass(e, "leaflet-control"),
                        -1 !== i.indexOf("bottom") ? n.insertBefore(e, n.firstChild) : n.appendChild(e),
                        this
                    },
                    removeFrom: function(t) {
                        var e = this.getPosition();
                        return t._controlCorners[e].removeChild(this._container),
                        this._map = null,
                        this.onRemove && this.onRemove(t),
                        this
                    },
                    _refocusOnMap: function() {
                        this._map && this._map.getContainer().focus()
                    }
                }),
                _.control = function(t) {
                    return new _.Control(t)
                }
                ,
                _.Map.include({
                    addControl: function(t) {
                        return t.addTo(this),
                        this
                    },
                    removeControl: function(t) {
                        return t.removeFrom(this),
                        this
                    },
                    _initControlPos: function() {
                        var n = this._controlCorners = {}
                          , o = "leaflet-"
                          , s = this._controlContainer = _.DomUtil.create("div", o + "control-container", this._container);
                        function t(t, e) {
                            var i = o + t + " " + o + e;
                            n[t + e] = _.DomUtil.create("div", i, s)
                        }
                        t("top", "left"),
                        t("top", "right"),
                        t("bottom", "left"),
                        t("bottom", "right")
                    },
                    _clearControlPos: function() {
                        this._container.removeChild(this._controlContainer)
                    }
                }),
                _.Control.Zoom = _.Control.extend({
                    options: {
                        position: "topleft",
                        zoomInText: "+",
                        zoomInTitle: "Zoom in",
                        zoomOutText: "-",
                        zoomOutTitle: "Zoom out"
                    },
                    onAdd: function(t) {
                        var e = "leaflet-control-zoom"
                          , i = _.DomUtil.create("div", e + " leaflet-bar");
                        return this._map = t,
                        this._zoomInButton = this._createButton(this.options.zoomInText, this.options.zoomInTitle, e + "-in", i, this._zoomIn, this),
                        this._zoomOutButton = this._createButton(this.options.zoomOutText, this.options.zoomOutTitle, e + "-out", i, this._zoomOut, this),
                        this._updateDisabled(),
                        t.on("zoomend zoomlevelschange", this._updateDisabled, this),
                        i
                    },
                    onRemove: function(t) {
                        t.off("zoomend zoomlevelschange", this._updateDisabled, this)
                    },
                    _zoomIn: function(t) {
                        this._map.zoomIn(t.shiftKey ? 3 : 1)
                    },
                    _zoomOut: function(t) {
                        this._map.zoomOut(t.shiftKey ? 3 : 1)
                    },
                    _createButton: function(t, e, i, n, o, s) {
                        var a = _.DomUtil.create("a", i, n);
                        a.innerHTML = t,
                        a.href = "#",
                        a.title = e;
                        var r = _.DomEvent.stopPropagation;
                        return _.DomEvent.on(a, "click", r).on(a, "mousedown", r).on(a, "dblclick", r).on(a, "click", _.DomEvent.preventDefault).on(a, "click", o, s).on(a, "click", this._refocusOnMap, s),
                        a
                    },
                    _updateDisabled: function() {
                        var t = this._map
                          , e = "leaflet-disabled";
                        _.DomUtil.removeClass(this._zoomInButton, e),
                        _.DomUtil.removeClass(this._zoomOutButton, e),
                        t._zoom === t.getMinZoom() && _.DomUtil.addClass(this._zoomOutButton, e),
                        t._zoom === t.getMaxZoom() && _.DomUtil.addClass(this._zoomInButton, e)
                    }
                }),
                _.Map.mergeOptions({
                    zoomControl: !0
                }),
                _.Map.addInitHook(function() {
                    this.options.zoomControl && (this.zoomControl = new _.Control.Zoom,
                    this.addControl(this.zoomControl))
                }),
                _.control.zoom = function(t) {
                    return new _.Control.Zoom(t)
                }
                ,
                _.Control.Attribution = _.Control.extend({
                    options: {
                        position: "bottomright",
                        prefix: '<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>'
                    },
                    initialize: function(t) {
                        _.setOptions(this, t),
                        this._attributions = {}
                    },
                    onAdd: function(t) {
                        for (var e in this._container = _.DomUtil.create("div", "leaflet-control-attribution"),
                        _.DomEvent.disableClickPropagation(this._container),
                        t._layers)
                            t._layers[e].getAttribution && this.addAttribution(t._layers[e].getAttribution());
                        return t.on("layeradd", this._onLayerAdd, this).on("layerremove", this._onLayerRemove, this),
                        this._update(),
                        this._container
                    },
                    onRemove: function(t) {
                        t.off("layeradd", this._onLayerAdd).off("layerremove", this._onLayerRemove)
                    },
                    setPrefix: function(t) {
                        return this.options.prefix = t,
                        this._update(),
                        this
                    },
                    addAttribution: function(t) {
                        if (t)
                            return this._attributions[t] || (this._attributions[t] = 0),
                            this._attributions[t]++,
                            this._update(),
                            this
                    },
                    removeAttribution: function(t) {
                        if (t)
                            return this._attributions[t] && (this._attributions[t]--,
                            this._update()),
                            this
                    },
                    _update: function() {
                        if (this._map) {
                            var t = [];
                            for (var e in this._attributions)
                                this._attributions[e] && t.push(e);
                            var i = [];
                            this.options.prefix && i.push(this.options.prefix),
                            t.length && i.push(t.join(", ")),
                            this._container.innerHTML = i.join(" | ")
                        }
                    },
                    _onLayerAdd: function(t) {
                        t.layer.getAttribution && this.addAttribution(t.layer.getAttribution())
                    },
                    _onLayerRemove: function(t) {
                        t.layer.getAttribution && this.removeAttribution(t.layer.getAttribution())
                    }
                }),
                _.Map.mergeOptions({
                    attributionControl: !0
                }),
                _.Map.addInitHook(function() {
                    this.options.attributionControl && (this.attributionControl = (new _.Control.Attribution).addTo(this))
                }),
                _.control.attribution = function(t) {
                    return new _.Control.Attribution(t)
                }
                ,
                _.Control.Scale = _.Control.extend({
                    options: {
                        position: "bottomleft",
                        maxWidth: 100,
                        metric: !0,
                        imperial: !0,
                        updateWhenIdle: !1
                    },
                    onAdd: function(t) {
                        this._map = t;
                        var e = "leaflet-control-scale"
                          , i = _.DomUtil.create("div", e)
                          , n = this.options;
                        return this._addScales(n, e, i),
                        t.on(n.updateWhenIdle ? "moveend" : "move", this._update, this),
                        t.whenReady(this._update, this),
                        i
                    },
                    onRemove: function(t) {
                        t.off(this.options.updateWhenIdle ? "moveend" : "move", this._update, this)
                    },
                    _addScales: function(t, e, i) {
                        t.metric && (this._mScale = _.DomUtil.create("div", e + "-line", i)),
                        t.imperial && (this._iScale = _.DomUtil.create("div", e + "-line", i))
                    },
                    _update: function() {
                        var t = this._map.getBounds()
                          , e = t.getCenter().lat
                          , i = 6378137 * Math.PI * Math.cos(e * Math.PI / 180) * (t.getNorthEast().lng - t.getSouthWest().lng) / 180
                          , n = this._map.getSize()
                          , o = this.options
                          , s = 0;
                        0 < n.x && (s = i * (o.maxWidth / n.x)),
                        this._updateScales(o, s)
                    },
                    _updateScales: function(t, e) {
                        t.metric && e && this._updateMetric(e),
                        t.imperial && e && this._updateImperial(e)
                    },
                    _updateMetric: function(t) {
                        var e = this._getRoundNum(t);
                        this._mScale.style.width = this._getScaleWidth(e / t) + "px",
                        this._mScale.innerHTML = e < 1e3 ? e + " m" : e / 1e3 + " km"
                    },
                    _updateImperial: function(t) {
                        var e, i, n, o = 3.2808399 * t, s = this._iScale;
                        5280 < o ? (e = o / 5280,
                        i = this._getRoundNum(e),
                        s.style.width = this._getScaleWidth(i / e) + "px",
                        s.innerHTML = i + " mi") : (n = this._getRoundNum(o),
                        s.style.width = this._getScaleWidth(n / o) + "px",
                        s.innerHTML = n + " ft")
                    },
                    _getScaleWidth: function(t) {
                        return Math.round(this.options.maxWidth * t) - 10
                    },
                    _getRoundNum: function(t) {
                        var e = Math.pow(10, (Math.floor(t) + "").length - 1)
                          , i = t / e;
                        return e * (i = 10 <= i ? 10 : 5 <= i ? 5 : 3 <= i ? 3 : 2 <= i ? 2 : 1)
                    }
                }),
                _.control.scale = function(t) {
                    return new _.Control.Scale(t)
                }
                ,
                _.Control.Layers = _.Control.extend({
                    options: {
                        collapsed: !0,
                        position: "topright",
                        autoZIndex: !0
                    },
                    initialize: function(t, e, i) {
                        for (var n in _.setOptions(this, i),
                        this._layers = {},
                        this._lastZIndex = 0,
                        this._handlingClick = !1,
                        t)
                            this._addLayer(t[n], n);
                        for (n in e)
                            this._addLayer(e[n], n, !0)
                    },
                    onAdd: function(t) {
                        return this._initLayout(),
                        this._update(),
                        t.on("layeradd", this._onLayerChange, this).on("layerremove", this._onLayerChange, this),
                        this._container
                    },
                    onRemove: function(t) {
                        t.off("layeradd", this._onLayerChange, this).off("layerremove", this._onLayerChange, this)
                    },
                    addBaseLayer: function(t, e) {
                        return this._addLayer(t, e),
                        this._update(),
                        this
                    },
                    addOverlay: function(t, e) {
                        return this._addLayer(t, e, !0),
                        this._update(),
                        this
                    },
                    removeLayer: function(t) {
                        var e = _.stamp(t);
                        return delete this._layers[e],
                        this._update(),
                        this
                    },
                    _initLayout: function() {
                        var t = "leaflet-control-layers"
                          , e = this._container = _.DomUtil.create("div", t);
                        e.setAttribute("aria-haspopup", !0),
                        _.Browser.touch ? _.DomEvent.on(e, "click", _.DomEvent.stopPropagation) : _.DomEvent.disableClickPropagation(e).disableScrollPropagation(e);
                        var i, n = this._form = _.DomUtil.create("form", t + "-list");
                        this.options.collapsed ? (_.Browser.android || _.DomEvent.on(e, "mouseover", this._expand, this).on(e, "mouseout", this._collapse, this),
                        (i = this._layersLink = _.DomUtil.create("a", t + "-toggle", e)).href = "#",
                        i.title = "Layers",
                        _.Browser.touch ? _.DomEvent.on(i, "click", _.DomEvent.stop).on(i, "click", this._expand, this) : _.DomEvent.on(i, "focus", this._expand, this),
                        _.DomEvent.on(n, "click", function() {
                            setTimeout(_.bind(this._onInputClick, this), 0)
                        }, this),
                        this._map.on("click", this._collapse, this)) : this._expand(),
                        this._baseLayersList = _.DomUtil.create("div", t + "-base", n),
                        this._separator = _.DomUtil.create("div", t + "-separator", n),
                        this._overlaysList = _.DomUtil.create("div", t + "-overlays", n),
                        e.appendChild(n)
                    },
                    _addLayer: function(t, e, i) {
                        var n = _.stamp(t);
                        this._layers[n] = {
                            layer: t,
                            name: e,
                            overlay: i
                        },
                        this.options.autoZIndex && t.setZIndex && (this._lastZIndex++,
                        t.setZIndex(this._lastZIndex))
                    },
                    _update: function() {
                        if (this._container) {
                            this._baseLayersList.innerHTML = "",
                            this._overlaysList.innerHTML = "";
                            var t, e, i = !1, n = !1;
                            for (t in this._layers)
                                e = this._layers[t],
                                this._addItem(e),
                                n = n || e.overlay,
                                i = i || !e.overlay;
                            this._separator.style.display = n && i ? "" : "none"
                        }
                    },
                    _onLayerChange: function(t) {
                        var e, i = this._layers[_.stamp(t.layer)];
                        i && (this._handlingClick || this._update(),
                        (e = i.overlay ? "layeradd" === t.type ? "overlayadd" : "overlayremove" : "layeradd" === t.type ? "baselayerchange" : null) && this._map.fire(e, i))
                    },
                    _createRadioElement: function(t, e) {
                        var i = '<input type="radio" class="leaflet-control-layers-selector" name="' + t + '"';
                        e && (i += ' checked="checked"'),
                        i += "/>";
                        var n = p.createElement("div");
                        return n.innerHTML = i,
                        n.firstChild
                    },
                    _addItem: function(t) {
                        var e, i = p.createElement("label"), n = this._map.hasLayer(t.layer);
                        t.overlay ? ((e = p.createElement("input")).type = "checkbox",
                        e.className = "leaflet-control-layers-selector",
                        e.defaultChecked = n) : e = this._createRadioElement("leaflet-base-layers", n),
                        e.layerId = _.stamp(t.layer),
                        _.DomEvent.on(e, "click", this._onInputClick, this);
                        var o = p.createElement("span");
                        return o.innerHTML = " " + t.name,
                        i.appendChild(e),
                        i.appendChild(o),
                        (t.overlay ? this._overlaysList : this._baseLayersList).appendChild(i),
                        i
                    },
                    _onInputClick: function() {
                        var t, e, i, n = this._form.getElementsByTagName("input"), o = n.length;
                        for (this._handlingClick = !0,
                        t = 0; t < o; t++)
                            e = n[t],
                            i = this._layers[e.layerId],
                            e.checked && !this._map.hasLayer(i.layer) ? this._map.addLayer(i.layer) : !e.checked && this._map.hasLayer(i.layer) && this._map.removeLayer(i.layer);
                        this._handlingClick = !1,
                        this._refocusOnMap()
                    },
                    _expand: function() {
                        _.DomUtil.addClass(this._container, "leaflet-control-layers-expanded")
                    },
                    _collapse: function() {
                        this._container.className = this._container.className.replace(" leaflet-control-layers-expanded", "")
                    }
                }),
                _.control.layers = function(t, e, i) {
                    return new _.Control.Layers(t,e,i)
                }
                ,
                _.PosAnimation = _.Class.extend({
                    includes: _.Mixin.Events,
                    run: function(t, e, i, n) {
                        this.stop(),
                        this._el = t,
                        this._inProgress = !0,
                        this._newPos = e,
                        this.fire("start"),
                        t.style[_.DomUtil.TRANSITION] = "all " + (i || .25) + "s cubic-bezier(0,0," + (n || .5) + ",1)",
                        _.DomEvent.on(t, _.DomUtil.TRANSITION_END, this._onTransitionEnd, this),
                        _.DomUtil.setPosition(t, e),
                        _.Util.falseFn(t.offsetWidth),
                        this._stepTimer = setInterval(_.bind(this._onStep, this), 50)
                    },
                    stop: function() {
                        this._inProgress && (_.DomUtil.setPosition(this._el, this._getPos()),
                        this._onTransitionEnd(),
                        _.Util.falseFn(this._el.offsetWidth))
                    },
                    _onStep: function() {
                        var t = this._getPos();
                        t ? (this._el._leaflet_pos = t,
                        this.fire("step")) : this._onTransitionEnd()
                    },
                    _transformRe: /([-+]?(?:\d*\.)?\d+)\D*, ([-+]?(?:\d*\.)?\d+)\D*\)/,
                    _getPos: function() {
                        var t, e, i, n = this._el, o = s.getComputedStyle(n);
                        if (_.Browser.any3d) {
                            if (!(i = o[_.DomUtil.TRANSFORM].match(this._transformRe)))
                                return;
                            t = parseFloat(i[1]),
                            e = parseFloat(i[2])
                        } else
                            t = parseFloat(o.left),
                            e = parseFloat(o.top);
                        return new _.Point(t,e,!0)
                    },
                    _onTransitionEnd: function() {
                        _.DomEvent.off(this._el, _.DomUtil.TRANSITION_END, this._onTransitionEnd, this),
                        this._inProgress && (this._inProgress = !1,
                        this._el.style[_.DomUtil.TRANSITION] = "",
                        this._el._leaflet_pos = this._newPos,
                        clearInterval(this._stepTimer),
                        this.fire("step").fire("end"))
                    }
                }),
                _.Map.include({
                    setView: function(t, e, i) {
                        if ((e = e === a ? this._zoom : this._limitZoom(e),
                        t = this._limitCenter(_.latLng(t), e, this.options.maxBounds),
                        i = i || {},
                        this._panAnim && this._panAnim.stop(),
                        this._loaded && !i.reset && !0 !== i) && (i.animate !== a && (i.zoom = _.extend({
                            animate: i.animate
                        }, i.zoom),
                        i.pan = _.extend({
                            animate: i.animate
                        }, i.pan)),
                        this._zoom !== e ? this._tryAnimatedZoom && this._tryAnimatedZoom(t, e, i.zoom) : this._tryAnimatedPan(t, i.pan)))
                            return clearTimeout(this._sizeTimer),
                            this;
                        return this._resetView(t, e),
                        this
                    },
                    panBy: function(t, e) {
                        return e = e || {},
                        ((t = _.point(t).round()).x || t.y) && (this._panAnim || (this._panAnim = new _.PosAnimation,
                        this._panAnim.on({
                            step: this._onPanTransitionStep,
                            end: this._onPanTransitionEnd
                        }, this)),
                        e.noMoveStart || this.fire("movestart"),
                        !1 !== e.animate ? (_.DomUtil.addClass(this._mapPane, "leaflet-pan-anim"),
                        i = this._getMapPanePos().subtract(t),
                        this._panAnim.run(this._mapPane, i, e.duration || .25, e.easeLinearity)) : (this._rawPanBy(t),
                        this.fire("move").fire("moveend"))),
                        this;
                        var i
                    },
                    _onPanTransitionStep: function() {
                        this.fire("move")
                    },
                    _onPanTransitionEnd: function() {
                        _.DomUtil.removeClass(this._mapPane, "leaflet-pan-anim"),
                        this.fire("moveend")
                    },
                    _tryAnimatedPan: function(t, e) {
                        var i = this._getCenterOffset(t)._floor();
                        return !(!0 !== (e && e.animate) && !this.getSize().contains(i)) && (this.panBy(i, e),
                        !0)
                    }
                }),
                _.PosAnimation = _.DomUtil.TRANSITION ? _.PosAnimation : _.PosAnimation.extend({
                    run: function(t, e, i, n) {
                        this.stop(),
                        this._el = t,
                        this._inProgress = !0,
                        this._duration = i || .25,
                        this._easeOutPower = 1 / Math.max(n || .5, .2),
                        this._startPos = _.DomUtil.getPosition(t),
                        this._offset = e.subtract(this._startPos),
                        this._startTime = +new Date,
                        this.fire("start"),
                        this._animate()
                    },
                    stop: function() {
                        this._inProgress && (this._step(),
                        this._complete())
                    },
                    _animate: function() {
                        this._animId = _.Util.requestAnimFrame(this._animate, this),
                        this._step()
                    },
                    _step: function() {
                        var t = new Date - this._startTime
                          , e = 1e3 * this._duration;
                        t < e ? this._runFrame(this._easeOut(t / e)) : (this._runFrame(1),
                        this._complete())
                    },
                    _runFrame: function(t) {
                        var e = this._startPos.add(this._offset.multiplyBy(t));
                        _.DomUtil.setPosition(this._el, e),
                        this.fire("step")
                    },
                    _complete: function() {
                        _.Util.cancelAnimFrame(this._animId),
                        this._inProgress = !1,
                        this.fire("end")
                    },
                    _easeOut: function(t) {
                        return 1 - Math.pow(1 - t, this._easeOutPower)
                    }
                }),
                _.Map.mergeOptions({
                    zoomAnimation: !0,
                    zoomAnimationThreshold: 4
                }),
                _.DomUtil.TRANSITION && _.Map.addInitHook(function() {
                    this._zoomAnimated = this.options.zoomAnimation && _.DomUtil.TRANSITION && _.Browser.any3d && !_.Browser.android23 && !_.Browser.mobileOpera,
                    this._zoomAnimated && _.DomEvent.on(this._mapPane, _.DomUtil.TRANSITION_END, this._catchTransitionEnd, this)
                }),
                _.Map.include(_.DomUtil.TRANSITION ? {
                    _catchTransitionEnd: function(t) {
                        this._animatingZoom && 0 <= t.propertyName.indexOf("transform") && this._onZoomTransitionEnd()
                    },
                    _nothingToAnimate: function() {
                        return !this._container.getElementsByClassName("leaflet-zoom-animated").length
                    },
                    _tryAnimatedZoom: function(t, e, i) {
                        if (this._animatingZoom)
                            return !0;
                        if (i = i || {},
                        !this._zoomAnimated || !1 === i.animate || this._nothingToAnimate() || Math.abs(e - this._zoom) > this.options.zoomAnimationThreshold)
                            return !1;
                        var n = this.getZoomScale(e)
                          , o = this._getCenterOffset(t)._divideBy(1 - 1 / n)
                          , s = this._getCenterLayerPoint()._add(o);
                        return !(!0 !== i.animate && !this.getSize().contains(o)) && (this.fire("movestart").fire("zoomstart"),
                        this._animateZoom(t, e, s, n, null, !0),
                        !0)
                    },
                    _animateZoom: function(t, e, i, n, o, s, a) {
                        a || (this._animatingZoom = !0),
                        _.DomUtil.addClass(this._mapPane, "leaflet-zoom-anim"),
                        this._animateToCenter = t,
                        this._animateToZoom = e,
                        _.Draggable && (_.Draggable._disabled = !0),
                        _.Util.requestAnimFrame(function() {
                            this.fire("zoomanim", {
                                center: t,
                                zoom: e,
                                origin: i,
                                scale: n,
                                delta: o,
                                backwards: s
                            })
                        }, this)
                    },
                    _onZoomTransitionEnd: function() {
                        this._animatingZoom = !1,
                        _.DomUtil.removeClass(this._mapPane, "leaflet-zoom-anim"),
                        this._resetView(this._animateToCenter, this._animateToZoom, !0, !0),
                        _.Draggable && (_.Draggable._disabled = !1)
                    }
                } : {}),
                _.TileLayer.include({
                    _animateZoom: function(t) {
                        this._animating || (this._animating = !0,
                        this._prepareBgBuffer());
                        var e = this._bgBuffer
                          , i = _.DomUtil.TRANSFORM
                          , n = t.delta ? _.DomUtil.getTranslateString(t.delta) : e.style[i]
                          , o = _.DomUtil.getScaleString(t.scale, t.origin);
                        e.style[i] = t.backwards ? o + " " + n : n + " " + o
                    },
                    _endZoomAnim: function() {
                        var t = this._tileContainer
                          , e = this._bgBuffer;
                        t.style.visibility = "",
                        t.parentNode.appendChild(t),
                        _.Util.falseFn(e.offsetWidth),
                        this._animating = !1
                    },
                    _clearBgBuffer: function() {
                        var t = this._map;
                        !t || t._animatingZoom || t.touchZoom._zooming || (this._bgBuffer.innerHTML = "",
                        this._bgBuffer.style[_.DomUtil.TRANSFORM] = "")
                    },
                    _prepareBgBuffer: function() {
                        var t = this._tileContainer
                          , e = this._bgBuffer
                          , i = this._getLoadedTilesPercentage(e)
                          , n = this._getLoadedTilesPercentage(t);
                        if (e && .5 < i && n < .5)
                            return t.style.visibility = "hidden",
                            void this._stopLoadingImages(t);
                        e.style.visibility = "hidden",
                        e.style[_.DomUtil.TRANSFORM] = "",
                        this._tileContainer = e,
                        e = this._bgBuffer = t,
                        this._stopLoadingImages(e),
                        clearTimeout(this._clearBgBufferTimer)
                    },
                    _getLoadedTilesPercentage: function(t) {
                        for (var e = t.getElementsByTagName("img"), i = 0, n = 0, o = e.length; n < o; n++)
                            e[n].complete && i++;
                        return i / o
                    },
                    _stopLoadingImages: function(t) {
                        for (var e, i = Array.prototype.slice.call(t.getElementsByTagName("img")), n = 0, o = i.length; n < o; n++)
                            (e = i[n]).complete || (e.onload = _.Util.falseFn,
                            e.onerror = _.Util.falseFn,
                            e.src = _.Util.emptyImageUrl,
                            e.parentNode.removeChild(e))
                    }
                }),
                _.Map.include({
                    _defaultLocateOptions: {
                        watch: !1,
                        setView: !1,
                        maxZoom: 1 / 0,
                        timeout: 1e4,
                        maximumAge: 0,
                        enableHighAccuracy: !1
                    },
                    locate: function(t) {
                        if (t = this._locateOptions = _.extend(this._defaultLocateOptions, t),
                        !navigator.geolocation)
                            return this._handleGeolocationError({
                                code: 0,
                                message: "Geolocation not supported."
                            }),
                            this;
                        var e = _.bind(this._handleGeolocationResponse, this)
                          , i = _.bind(this._handleGeolocationError, this);
                        return t.watch ? this._locationWatchId = navigator.geolocation.watchPosition(e, i, t) : navigator.geolocation.getCurrentPosition(e, i, t),
                        this
                    },
                    stopLocate: function() {
                        return navigator.geolocation && navigator.geolocation.clearWatch(this._locationWatchId),
                        this._locateOptions && (this._locateOptions.setView = !1),
                        this
                    },
                    _handleGeolocationError: function(t) {
                        var e = t.code
                          , i = t.message || (1 === e ? "permission denied" : 2 === e ? "position unavailable" : "timeout");
                        this._locateOptions.setView && !this._loaded && this.fitWorld(),
                        this.fire("locationerror", {
                            code: e,
                            message: "Geolocation error: " + i + "."
                        })
                    },
                    _handleGeolocationResponse: function(t) {
                        var e, i = t.coords.latitude, n = t.coords.longitude, o = new _.LatLng(i,n), s = 180 * t.coords.accuracy / 40075017, a = s / Math.cos(_.LatLng.DEG_TO_RAD * i), r = _.latLngBounds([i - s, n - a], [i + s, n + a]), h = this._locateOptions;
                        h.setView && (e = Math.min(this.getBoundsZoom(r), h.maxZoom),
                        this.setView(o, e));
                        var l = {
                            latlng: o,
                            bounds: r,
                            timestamp: t.timestamp
                        };
                        for (var u in t.coords)
                            "number" == typeof t.coords[u] && (l[u] = t.coords[u]);
                        this.fire("locationfound", l)
                    }
                })
            }(window, document)
        }
        ).call(this, i(2)(t))
    },
    2: function(t, e) {
        t.exports = function(t) {
            return t.webpackPolyfill || (t.deprecate = function() {}
            ,
            t.paths = [],
            t.children || (t.children = []),
            Object.defineProperty(t, "loaded", {
                enumerable: !0,
                get: function() {
                    return t.l
                }
            }),
            Object.defineProperty(t, "id", {
                enumerable: !0,
                get: function() {
                    return t.i
                }
            }),
            t.webpackPolyfill = 1),
            t
        }
    }
});
;!function(a) {
    var o = {};
    function i(e) {
        if (o[e])
            return o[e].exports;
        var t = o[e] = {
            i: e,
            l: !1,
            exports: {}
        };
        return a[e].call(t.exports, t, t.exports, i),
        t.l = !0,
        t.exports
    }
    i.m = a,
    i.c = o,
    i.d = function(e, t, a) {
        i.o(e, t) || Object.defineProperty(e, t, {
            enumerable: !0,
            get: a
        })
    }
    ,
    i.r = function(e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }),
        Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }
    ,
    i.t = function(t, e) {
        if (1 & e && (t = i(t)),
        8 & e)
            return t;
        if (4 & e && "object" == typeof t && t && t.__esModule)
            return t;
        var a = Object.create(null);
        if (i.r(a),
        Object.defineProperty(a, "default", {
            enumerable: !0,
            value: t
        }),
        2 & e && "string" != typeof t)
            for (var o in t)
                i.d(a, o, function(e) {
                    return t[e]
                }
                .bind(null, o));
        return a
    }
    ,
    i.n = function(e) {
        var t = e && e.__esModule ? function() {
            return e.default
        }
        : function() {
            return e
        }
        ;
        return i.d(t, "a", t),
        t
    }
    ,
    i.o = function(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }
    ,
    i.p = "",
    i(i.s = 804)
}({
    804: function(e, t) {
        function s(e, t, a) {
            return t in e ? Object.defineProperty(e, t, {
                value: a,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = a,
            e
        }
        var u, d = [], o = [];
        try {
            Raven.config("https://949abd285a78459496c8101951e98fb9@sentry.zomans.com/39", {
                tags: {
                    user_id: window.USER_ID
                }
            }).install()
        } catch (e) {}
        $(document).on("zready", function() {
            try {
                $(".modal").modal()
            } catch (e) {
                console.log("Failed to initiaze modal")
            }
            $("#interval-selector").chosen(),
            startPendingAlert(),
            $(".dropdown-button").dropdown({
                belowOrigin: !0
            }),
            addDispatchEvent(),
            d = window.selfDeliveryStatus,
            o = window.resNamesObj,
            getNotifications(),
            $(document).on("click", ".orderBlocks .view-phone", function(e) {
                var t = $(e.target)
                  , a = t.attr("data-tab-id");
                showPhoneNumber(t, a)
            }),
            window.$zopim && $zopim(function() {
                var e = resIdsList[0];
                $zopim.livechat.setName(window.resNamesObj[e] + " (" + e + ")"),
                $zopim.livechat.addTags("merchant_delight"),
                $zopim.livechat.setLanguage(window.LANG)
            });
            setInterval(function() {
                $(".merchant-dashboard-container").find(".runnr_boy_text").each(function() {
                    var e, t, a = +$(this).attr("data-hvo"), o = "0000-00-00 00:00:00" !== $(this).attr("data-rider_reached_kitchen"), i = +$(this).attr("data-eta");
                    a ? $(this).text("Rider is on his way.") : o ? $(this).html('<div class="zrunnr_symbol">Z</div> Rider - ' + $(this).attr("data-name") + " has arrived. Mobile number - " + $(this).attr("data-phone")) : i ? (e = Math.abs(new Date(1e3 * i) - new Date),
                    t = Math.floor(e / 1e3 / 60),
                    $(this).html('<div class="zrunnr_symbol">Z</div> Rider - ' + $(this).attr("data-name") + " is arriving in " + t + " minutes. Mobile number - " + $(this).attr("data-phone"))) : $(this).html('<div class="zrunnr_symbol">Z</div> Rider - ' + $(this).attr("data-name") + " is on his way. Mobile number - " + $(this).attr("data-phone"))
                })
            }, 1e3)
        });
        var n = window.kptFeatureEnabled;
        window.isModalOpen = 0,
        window.isCancelledModalOpen = 0,
        window.isReturnedModalOpen = 0,
        window.modalTab = 0,
        window.blinkFunction = null,
        window.pendingBlinker = null,
        window.isWindowOpen = !0,
        window.queueOrderRefreshInterval = 3e5;
        var a, i = 12e4, l = {};
        window.onfocus = function() {
            window.isWindowOpen = !0
        }
        ,
        window.onblur = function() {
            window.isWindowOpen = !1
        }
        ,
        window.newCloseModal = function() {
            clearTimeout(u),
            u = null,
            $(".modal").each(function(e) {
                $(this).hide()
            }),
            $(".lean-overlay").remove(),
            $("body").css("overflow", "auto"),
            (window.isModalOpen = 0) != parseInt(window.modalTab) && (deQueueTab(window.modalTab),
            window.modalTab = 0)
        }
        ,
        window.closeCancelledModal = function(e, t) {
            $("#view-cart-modal").hide(),
            $(".lean-overlay").remove(),
            (window.isCancelledModalOpen = 0) != parseInt(window.modalTab) && (window.deQueueCancelledTab(e),
            window.modalTab = 0),
            sendToJumbo("jevent", {
                ename: "rejection_popup_dismissed",
                var1: t,
                var2: e
            })
        }
        ,
        window.closeReturnedModal = function(e) {
            $("#view-cart-modal").hide(),
            $(".lean-overlay").remove(),
            (window.isReturnedModalOpen = 0) != parseInt(window.modalTab) && (window.deQueueReturnedTab(e),
            window.modalTab = 0)
        }
        ,
        window.checkEmptyState = function() {
            0 == $("#agent-order-list > .user-actions").length ? $("#empty-state-filler").show() : $("#empty-state-filler").hide()
        }
        ,
        window.startBlink = function() {
            $(".lean-overlay").addClass("activated"),
            $(".lean-overlay").addClass("red"),
            window.blinkFunction = setInterval(function() {
                $(".lean-overlay").toggleClass("red"),
                $(".lean-overlay").toggleClass("green")
            }, 500)
        }
        ,
        window.stopBlink = function() {
            clearInterval(window.blinkFunction),
            $(".lean-overlay").removeClass("activated"),
            $(".lean-overlay").removeClass("red"),
            $(".lean-overlay").removeClass("green")
        }
        ,
        window.startPendingAlert = function() {
            $(".pendingBlock").addClass("activated"),
            $(".pendingBlock").addClass("red"),
            window.pendingBlinker = setInterval(function() {
                $(".pendingBlock").toggleClass("red"),
                $(".pendingBlock").toggleClass("green")
            }, 500)
        }
        ,
        window.stopPendingAlert = function() {
            clearInterval(window.pendingBlinker),
            $(".pendingBlock").removeClass("activated"),
            $(".pendingBlock").removeClass("red"),
            $(".pendingBlock").removeClass("green")
        }
        ,
        window.playAlertSound = function() {
            var e = document.getElementById("alertSoundElement");
            e.currentTime = 0;
            var t = e.play();
            void 0 !== t && t.then(function(e) {}).catch(function(e) {}),
            startBlink(),
            window.Notification && Notification.requestPermission(function(e) {
                "granted" === e && navigator.serviceWorker.ready.then(function(e) {
                    e.showNotification("New Order Received", {
                        body: "You have received a new order.",
                        icon: "https://b.zmtcdn.com/images/logo/zlogo9.png"
                    })
                })
            })
        }
        ,
        window.playDispatchPopupAlertSound = function() {
            var e = document.getElementById("alertSoundElement");
            e.currentTime = 0,
            e.play(),
            startBlink()
        }
        ,
        window.stopAlertSound = function() {
            var e = document.getElementById("alertSoundElement");
            e.paused || e.pause(),
            stopBlink()
        }
        ,
        window.updateOrderData = function(n, s) {
            $.ajax({
                url: HOST + "php/merchant_ordering_dashboard.php",
                type: "POST",
                async: !1,
                data: {
                    method: "update-acceptance",
                    tab_id: n
                },
                success: function(e) {
                    if ("success" == e.status) {
                        var t = e.html
                          , a = e.res_id
                          , o = e.tab_status
                          , i = e.return_info
                          , r = e.user_reject;
                          if (r == "false" || r == 0 || r == 'false') {
                            $.ajax({
                                url: "http://localhost/RestoCommonAccess/ZMT?TID=" + e.toString(),
                                type: "GET",
                                success: console.log("Local Update-Accept Success")
                            })
                        } else {
                            console.log("Local Update-Accept FAILED")
                        }
                        if (!i || "RETURN_INIT" !== i.state && "RETURN_ACK" !== i.state ? -1 != [6, 7, 8].indexOf(o) ? ($('.row.user-actions[data-tab-id="' + n + '"]').remove(),
                        checkEmptyState(),
                        s = !1) : $('.row.user-actions[data-tab-id="' + n + '"]').replaceWith(t) : 0 == $('.row.user-actions[data-tab-id="' + n + '"]').length ? $("#agent-order-list").prepend(t) : $('.row.user-actions[data-tab-id="' + n + '"]').replaceWith(t),
                        1 == window.isModalOpen && window.modalTab == n && (window.newCloseModal(),
                        1 !== o && stopAlertSound()),
                        i && "RETURN_INIT" === i.state)
                            return 0 != window.isModalOpen || 0 != window.isReturnedModalOpen ? window.enQueueReturnedTab(n, a) : window.showReturnedOrderPopup(a, n),
                            !0;
                        if (8 === o && r && i && !i.state) {
                            if (0 != window.isModalOpen || 0 != window.isCancelledModalOpen)
                                return window.enQueueCancelledTab(n, a),
                                !0;
                            window.showCancelledOrderPopup(a, n)
                        }
                        return !0
                    }
                }
            }),
            1 == s && setTimeout(function() {
                window.updateOrderData(n, !1)
            }, 2e3)
        }
        ,
        window.showReturnedOrderPopup = function(r, n) {
            if (window.enQueueReturnedTab(n, r),
            0 != window.isModalOpen || 0 != window.isReturnedModalOpen)
                return !0;
            $.ajax({
                url: HOST + "php/merchant_ordering_dashboard.php",
                type: "POST",
                data: {
                    res_id: r,
                    tab_id: n,
                    method: "orderdetail"
                },
                success: function(e) {
                    var t = 1 == e.tab.isDeliveredByZomato ? 1 : 0
                      , a = (e.tab.status,
                    {
                        tab_id: n,
                        res_id: r,
                        order_items: e.tab.items,
                        status: e.tab.status,
                        delivery_status: e.tab.delivery_status,
                        currency: e.currency,
                        user_name: e.tab.name,
                        phone: e.tab.userPhone,
                        address: e.tab.deliveryAddress,
                        payment_block_class: e.tab.payment_block_class,
                        payment_affix: e.tab.payment_affix,
                        creator_orders_count: e.tab.creator_orders_count,
                        add_inst: null != e.tab.address_instructions ? e.tab.address_instructions : "Not Specified",
                        spcl_inst: null != e.tab.specialInstructions ? e.tab.specialInstructions : "Not Specified",
                        deliveryMode: e.tab.deliveryMode,
                        return_state: e.tab.return_info && e.tab.return_info.state ? e.tab.return_info.state : "",
                        return_rejection_message: e.tab.return_info && e.tab.return_info.rejectionReasonMessage ? e.tab.return_info.rejectionReasonMessage : "",
                        return_otp: e.tab.return_info && e.tab.return_info.otp ? e.tab.return_info.otp : 0,
                        rider_message: e.tab.return_info && e.tab.return_info.riderMessage ? e.tab.return_info.riderMessage : "",
                        delivered_by_zomato: e.tab.isDeliveredByZomato,
                        user_count_from_same_res: e.tab.user_count_from_same_res,
                        distance_from_res: e.tab.distance,
                        res_details: e.tab.res_details,
                        res_avg_time: e.tab.res_avg_time,
                        show_new_user_info: e.tab.show_new_user_info,
                        rejection_queued: e.tab.rejection_queued,
                        logistics_partner_id: t,
                        is_trace_enabled: e.tab.is_trace_enabled,
                        res_riders: e.tab.riders,
                        dispatch_popup: 0,
                        show_dispatch_button_time: e.tab.show_dispatch_button_time,
                        should_show_dispatch_button: e.tab.should_show_dispatch_button,
                        delivery_subzone_id: e.tab.delivery_subzone_id,
                        country_id: e.tab.country_id,
                        hybrid_order: e.tab.hybrid_order,
                        displayed_kpt: e.tab.displayed_kpt ? e.tab.displayed_kpt : 0,
                        prepare_by: e.tab.prepare_by || "",
                        cust_pickup_time: e.tab.cust_pickup_time,
                        cust_pickup_time_including_kpt: e.tab.cust_pickup_time_including_kpt,
                        collect_cash: e.tab.collect_cash,
                        res_lat: e.tab.res_lat,
                        res_long: e.tab.res_long,
                        user_lat: e.tab.user_lat,
                        user_long: e.tab.user_long,
                        otp: e.tab.otp,
                        order_messages: e.tab.order_messages,
                        rbt: e.tab.rbt
                    });
                    a.distance_from_res = Math.round(a.distance_from_res);
                    var o = s({
                        orderId: "ORDER ID",
                        noCashToBeCollectd: "No Cash to be collected",
                        cashToBeCollected: "Cash to be collected",
                        dispatchReminder: "DISPATCH REMINDER",
                        minutesLeftForDelivery: "minutes left for delivery",
                        print: "print",
                        runnrAvailable: "RUNNR AVAILABLE",
                        runnrNotAvailable: "RUNNR NOT AVAILABLE",
                        pickupOrder: "Pickup Order",
                        totalOrdersFromYourRes: "Total Orders from your restaurant",
                        otp: "OTP",
                        customerPickupTime: "Customer Pickup Time",
                        address: "Address",
                        deliveryInstructions: "Delivery Instructions",
                        specialCookingInstructions: "Special Cooking Instructions",
                        buyOneGetOneOfferApplied: "Buy one get one offer applied",
                        acceptOrder: "Accept Order",
                        rejectOrder: "Reject Order",
                        verifyId: "Verify ID",
                        okButton: "Ok",
                        hasTheOrderBeenDispatched: "Has this order been dispatched",
                        yes: "Yes",
                        no: "No",
                        dispatch: "Dispatch",
                        readyToPickup: "Ready to pickup"
                    }, "address", "Address");
                    a.localizedTexts = o;
                    var i = _.template($("#orderTemplate").html());
                    $("#view-cart-modal").html(i(a)),
                    $("#view-cart-modal").openModal({
                        ready: bindDialogActionEvents,
                        dismissible: !1
                    }),
                    window.isReturnedModalOpen = 1,
                    window.modalTab = n
                }
            })
        }
        ,
        window.showCancelledOrderPopup = function(i, r) {
            if (window.enQueueCancelledTab(r, i),
            0 != window.isModalOpen || 0 != window.isCancelledModalOpen)
                return !0;
            $.ajax({
                url: HOST + "php/merchant_ordering_dashboard.php",
                type: "POST",
                data: {
                    res_id: i,
                    tab_id: r,
                    method: "orderdetail"
                },
                success: function(e) {
                    var t = 1 == e.tab.isDeliveredByZomato ? 1 : 0
                      , a = (e.tab.status,
                    {
                        tab_id: r,
                        res_id: i,
                        order_items: e.tab.items,
                        status: e.tab.status,
                        delivery_status: e.tab.delivery_status,
                        currency: e.currency,
                        user_name: e.tab.name,
                        phone: e.tab.userPhone,
                        address: e.tab.deliveryAddress,
                        payment_block_class: e.tab.payment_block_class,
                        payment_affix: e.tab.payment_affix,
                        creator_orders_count: e.tab.creator_orders_count,
                        add_inst: null != e.tab.address_instructions ? e.tab.address_instructions : "Not Specified",
                        spcl_inst: null != e.tab.specialInstructions ? e.tab.specialInstructions : "Not Specified",
                        deliveryMode: e.tab.deliveryMode,
                        delivered_by_zomato: e.tab.isDeliveredByZomato,
                        user_count_from_same_res: e.tab.user_count_from_same_res,
                        distance_from_res: e.tab.distance,
                        res_details: e.tab.res_details,
                        res_avg_time: e.tab.res_avg_time,
                        show_new_user_info: e.tab.show_new_user_info,
                        rejection_queued: e.tab.rejection_queued,
                        logistics_partner_id: t,
                        is_trace_enabled: e.tab.is_trace_enabled,
                        res_riders: e.tab.riders,
                        dispatch_popup: 0,
                        show_dispatch_button_time: e.tab.show_dispatch_button_time,
                        should_show_dispatch_button: e.tab.should_show_dispatch_button,
                        delivery_subzone_id: e.tab.delivery_subzone_id,
                        country_id: e.tab.country_id,
                        hybrid_order: e.tab.hybrid_order,
                        displayed_kpt: e.tab.displayed_kpt ? e.tab.displayed_kpt : 0,
                        cancellation_reason: e.tab.cancellation_reason,
                        runnr_return_flow_otp: e.tab.runnr_return_flow_otp,
                        cancellation_refund_text: e.tab.cancellation_refund_text,
                        on_view_click: 1,
                        otp: e.tab.otp
                    });
                    a.distance_from_res = Math.round(a.distance_from_res);
                    a.localizedTexts = {
                        orderId: "ORDER ID",
                        noCashToBeCollectd: "No Cash to be collected",
                        cashToBeCollected: "Cash to be collected",
                        dispatchReminder: "DISPATCH REMINDER",
                        minutesLeftForDelivery: "minutes left for delivery",
                        print: "print",
                        runnrAvailable: "RUNNR AVAILABLE",
                        runnrNotAvailable: "RUNNR NOT AVAILABLE",
                        pickupOrder: "Pickup Order",
                        totalOrdersFromYourRes: "Total Orders from your restaurant",
                        otp: "OTP",
                        customerPickupTime: "Customer Pickup Time",
                        address: "Address",
                        deliveryInstructions: "Delivery Instructions",
                        specialCookingInstructions: "Special Cooking Instructions",
                        buyOneGetOneOfferApplied: "Buy one get one offer applied",
                        acceptOrder: "Accept Order",
                        rejectOrder: "Reject Order",
                        hasTheOrderBeenDispatched: "Has this order been dispatched",
                        yes: "Yes",
                        no: "No",
                        dispatch: "Dispatch",
                        readyToPickup: "Ready to pickup",
                        dismiss: "Dismiss"
                    };
                    var o = _.template($("#cancelledOrderTemplate").html());
                    $("#view-cart-modal").html(o(a)),
                    $("#view-cart-modal").openModal({
                        dismissible: !1
                    }),
                    $("#view-cart-modal").off("click", ".dismissCancelledOrder").on("click", ".dismissCancelledOrder", closeCancelledModal.bind(null, r, i)),
                    window.isCancelledModalOpen = 1,
                    window.modalTab = r
                }
            })
        }
        ,
        window.resActivePolling = function t() {
            var e = window.resIdsList.join();
            $.ajax({
                url: HOST + "php/merchant_ordering_dashboard.php?ping_time=" + Date.now(),
                type: "POST",
                data: {
                    method: "res_active_polling",
                    resIds: e
                },
                success: function(e) {
                    "success" === e.status ? (0 == e.delivery_status && alert(e.message),
                    0 < e.polling_frequency && i !== e.polling_frequency && (clearInterval(a),
                    i = e.polling_frequency,
                    a = setInterval(t, i))) : "refresh" == e.status && (alert(e.message),
                    window.location.reload())
                }
            })
        }
        ,
        $(document).off("click", ".mark-order-ready").on("click", ".mark-order-ready", function() {
            var t = $(this).parents(".user-actions").data("tab-id")
              , e = $(this).parents(".user-actions").data("res_id");
            sendToJumbo("jevent", {
                ename: "merchantClickedOnReadyForDispatch",
                var1: e,
                var2: t,
                var3: "MERCHANT_WEB"
            }),
            $.ajax({
                url: HOST + "php/merchant_ordering_dashboard.php",
                type: "POST",
                data: {
                    method: "mark_order_ready",
                    tab_id: t
                },
                success: function() {
                    var e = ".order-ready." + t;
                    $(".mark-order-ready." + t).hide(),
                    $(e).text("Order is ready")
                }
            })
        }),
        window.disableResActivePolling || (a = setInterval(resActivePolling, i)),
        $(document).off("click", "#filter-orders").on("click", "#filter-orders", function(e) {
            e.preventDefault();
            var t = parseInt($("#city-selector").val())
              , a = parseInt($("#poc-selector").val())
              , o = parseInt($("#tl-selector").val())
              , i = parseInt($("#payment-selector").val())
              , r = 0;
            document.getElementById("interval-selector") && (r = parseInt($("#interval-selector").val()));
            var n = [];
            0 != t && n.push("city_id=" + t),
            0 != a && n.push("poc_id=" + a),
            0 != o && n.push("team_lead_id=" + o),
            0 != r && n.push("order_interval=" + r),
            0 != i && n.push("payment_filter=" + i);
            var s = n.join("&");
            "" != s ? document.location.assign(HOST + "admin/tools/ordering.php?" + s) : document.location.assign(HOST + "admin/tools/ordering.php")
        }),
        window.sendActionRequest = function(a, o) {
            var i = a.action
              , r = o.data("tab-id")
              , n = o.data("zomato-fullfilled");
            $.ajax({
                url: HOST + "php/merchant_ordering_dashboard.php",
                type: "POST",
                data: a,
                dataType: "json",
                success: function(e) {
                    var t;
                    "success" == e.status ? (window.newCloseModal(),
                    o.removeClass("unanswered"),
                    "decline" == i ? (sendToJumbo("jevent", {
                        ename: "OOS_reject",
                        var1: $("#res_id").data("res_id"),
                        var2: r,
                        var3: "MERCHANT_WEB"
                    }),
                    o.remove(),
                    checkEmptyState(),
                    alert(e.message + " " + (e.secondary_message || ""))) : "accept" == i ? (o.find(".accept").remove(),
                    o.find(".reject").remove(),
                    $.ajax({
                        url: "http://localhost/RestoCommonAccess/ZMT?TID=" + a.tab_id,
                        type: "GET",
                        success: console.log("Local Accept Success")
                    }),
                    0 == n && o.find(".dispatch").show()) : "move_to_delivery" == i && (o.find(".dispatch").removeClass("hidden"),
                    o.remove(),
                    checkEmptyState(),
                    t = $("<h6>Order Dispatched <br></h6>"),
                    Materialize.toast(t, 2e3)),
                    e.secondary_comment && ($("#secondary-comment-" + r).html(e.secondary_comment),
                    $("#secondary-comment-" + r).data("secondary-comment-no", a.secondary_comment)),
                    $("#comment-" + r).html(a.comment)) : (alert(e.message),
                    "refresh" == e.status || "timeout" == e.status ? window.location.reload() : "queued" == e.status && (window.newCloseModal(),
                    queuedOrderChange(o)))
                }
            }),
            "accept" == i && window.updateOrderData(r, !0)
        }
        ,
        window.queuedOrderChange = function(e) {
            e.find(".pendingBlock").append("<div class='addressInfo textInfo'>Under review by Zomato</div>")
        }
        ,
        window.timestampToFriendly = function(e) {
            var t, a = "", o = t = 0;
            return 3600 <= e && (e -= 3600 * (o = parseInt(e / 3600, 10))),
            60 <= e && (e -= 60 * (t = parseInt(e / 60, 10))),
            0 < o && (a += String(o) + "h "),
            0 < t && (a += String(t) + "m "),
            a += String(e) + "s ago"
        }
        ,
        window.getSecondaryResponses = function() {
            $.ajax({
                url: HOST + "php/ordering_dashboard.php",
                type: "POST",
                data: {
                    action: "get-secondary-response"
                },
                success: function(e) {
                    return e
                }
            })
        }
        ,
        window.addDialogEventsUpdateComment = function() {
            var r = $(".submit-response").data("tab-id");
            $("#response-selector").val($("#secondary-comment-" + r).data("secondary-comment-no")),
            $("#response-selector").chosen(),
            $(".primary-comment").val(document.getElementById("comment-" + r).textContent.trim()),
            $("#dialog-body").off("click", ".submit-response").on("click", ".submit-response", function(e) {
                var t = $(".primary-comment").val()
                  , a = $("#response-selector").find(":selected").val()
                  , o = {
                    action: "update-comment",
                    tab_id: r,
                    comment: t,
                    secondary_comment: a
                }
                  , i = $('[data-tab-id="' + r + '"]');
                sendActionRequest(o, i)
            })
        }
        ,
        window.addDialogEventsRes = function() {
            $("#response-selector").chosen(),
            $("#dialog-body").off("click", ".submit-response").on("click", ".submit-response", function(e) {
                var t = $(".primary-comment").val()
                  , a = $(".submit-response").data("tab-id")
                  , o = {
                    action: "verify",
                    tab_id: a,
                    comment: t,
                    secondary_comment: $("#response-selector").find(":selected").val()
                }
                  , i = $('[data-tab-id="' + a + '"]');
                sendActionRequest(o, i)
            })
        }
        ;
        function c(e, t, a) {
            return 1 < arguments.length && "string" != typeof t ? a : (void 0 !== e && "string" == typeof t && (e = t.split(/[.\[\]'"]/g).filter(function(e) {
                return "" !== e
            }).reduce(function(e, t) {
                return e && "undefined" !== e[t] ? e[t] : a
            }, e)),
            e)
        }
        function r(e) {
            window.open(e, "_blank").focus()
        }
        window.addDialogEventsRej = function() {
            $("#reject-order-modal").css("height", "50%"),
            $("#reject-order-modal").css("width", "40%"),
            $("#reject-order-modal").css({
                top: "21%"
            });
            var n, s, r = $(".modal .confirm-reject"), a = r.data("tab-id"), e = {
                tab_id: a,
                method: "populate_rejection_reasons"
            }, d = $("#missingItemsList");
            $.ajax({
                url: HOST + "php/merchant_ordering_dashboard.php",
                type: "POST",
                data: e,
                success: function(e) {
                    var t = $("#reject-reasons")
                      , a = $("#rejectionPenalty");
                    s = c(e, "rejection_info", []),
                    n = c(e, "created_at", ""),
                    t.chosen({
                        width: "306px"
                    }),
                    t.html(e.reasons),
                    t.trigger("chosen:updated"),
                    t.trigger("change");
                    var o = getRejectionPenalty(s, n);
                    a.data("penaltyAmount", c(o, "penalty_amount", 0));
                    var i = '<div class="zred"><b>' + c(o, "message.penalty_amount_message", "") + "</b></div>"
                      , r = '<div class="grey-text">' + c(o, "message.penalty_time_message", "") + "</div>";
                    a.html("<div>" + i + r + "</div>")
                }
            }),
            $.ajax({
                url: HOST + "php/merchant_ordering_dashboard.php",
                type: "POST",
                data: {
                    tab_id: a,
                    method: "populateOnlyItems",
                    csrfToken: zomato.csrft
                },
                success: function(e) {
                    d.html(e.html),
                    d.chosen({
                        width: "100%"
                    })
                }
            }),
            $(".modal").off("change", "#reject-reasons").on("change", "#reject-reasons", function() {
                var e = $("#reject-reasons").find(":selected").val();
                hideShowMissingItemsList(1 == e)
            }),
            $(".modal").off("change", "#missingItemsList").on("change", "#missingItemsList", function(e) {
                var t = d.val()
                  , a = 0
                  , o = 0;
                null === t ? r.attr("disabled", "false") : (a = d.find("option").length,
                o = t.length,
                r.removeAttr("disabled")),
                showOOSText(o, a)
            }),
            $(".modal").off("click", ".view-phone").on("click", ".view-phone", function(e) {
                var t = $(e.target);
                showPhoneNumber(t, a, "OOS_call_customer")
            }),
            $(".modal").off("click", ".confirm-reject").on("click", ".confirm-reject", function(e) {
                var t = r.data("tab-id")
                  , a = $("#reject-reasons").find(":selected").val();
                if (0 == a)
                    return $("#reject-order-modal .empty_reason_prompt").show(),
                    !1;
                var o = {
                    action: "decline",
                    tab_id: t,
                    message_id: a,
                    message_text: "",
                    method: "deliverytabresponse",
                    item_ids: 1 == a ? d.val() : []
                }
                  , i = $('[data-tab-id="' + t + '"]');
                sendActionRequest(o, i)
            })
        }
        ,
        window.showOOSText = function(e, t) {
            var a, o, i = $("#oosText");
            e ? (a = _.template($("#out_of_stock_template").html()),
            (o = {
                count: e,
                totalCount: t
            }).localizedTexts = {
                tryCallingCustomerAndSuggestingAlternate: "Please try calling the customer once and suggesting an alternative for this item.",
                youCanStillSaveOrder: "You can still save the order by calling the customer and Suggesting an Alternative.",
                theseItem: "These item",
                theseItems: "These items",
                autoEnabledMsg: "will be turned off and will be auto-enabled before your first mealtime tomorrow.",
                ifAvailableEarlierMsg: "available earlier than that please enable the same from delivery menu section.",
                inCaseYouHave: "In case you have"
            },
            i.show(),
            i.html(a(o))) : i.hide()
        }
        ,
        window.hideShowMissingItemsList = function(e) {
            var t = $("#missingItemListWrap");
            e ? (t.show(),
            $("#missingItemsList").trigger("change")) : (t.hide(),
            $(".modal .confirm-reject").removeAttr("disabled"))
        }
        ,
        window.addDialogEventsAcc = function() {
            $("#accept-order-modal").css("height", "30%"),
            $("#accept-order-modal").css("width", "40%"),
            $("#accept-order-modal").css({
                top: "21%"
            });
            var e, t, a = $(".confirm-accept").data("avg-time"), o = $(".confirm-accept").data("tab-id"), i = parseInt($("#time-selector").data("logistics-partner-id"));
            a = 0 == i ? (t = e = a,
            $("#time-selector > option").each(function() {
                return this.value >= a ? (t = this.value,
                !1) : void (e = this.value)
            }),
            Math.abs(a - e) > Math.abs(a - t) ? t : e) : $(".confirm-accept").data("displayed-kpt");
            var r, n = $("#time-selector option[value=" + a + "]");
            0 == n.length ? (r = 0 < i ? 15 : 30,
            sendToJumbo("jevent", {
                ename: "kpt_on_frontend_dropdown",
                var1: o,
                var2: r,
                var3: "default_time"
            }),
            $("#time-selector option[value=" + r + "]").prop("selected", !0)) : (sendToJumbo("jevent", {
                ename: "kpt_on_frontend_dropdown",
                var1: o,
                var2: a,
                var3: "avg_time"
            }),
            n.prop("selected", !0)),
            $(".modal").off("click", ".confirm-accept").on("click", ".confirm-accept", function(e) {
                var t = $(".primary-comment").val()
                  , a = $(".confirm-accept").data("tab-id")
                  , o = $("#response-selector").find(":selected").val()
                  , i = $("#time-selector").find(":selected").val()
                  , r = {
                    action: "accept",
                    tab_id: a,
                    delivery_time: i,
                    comment: t,
                    secondary_comment: o,
                    method: "deliverytabresponse"
                }
                  , n = $('[data-tab-id="' + a + '"]');
                sendToJumbo("jevent", {
                    ename: "kpt_to_backend",
                    var1: a,
                    var2: i
                }),
                sendActionRequest(r, n)
            })
        }
        ,
        window.addActionButtonEvent = function() {
            var t = $(this).parents(".user-actions");
            (i = {
                tab_id: t.data("tab-id")
            }).localizedTexts = {
                reasonToReject: "Reason to Reject",
                selectReasonToReject: "Please select a reason for rejecting the order.",
                selectItemOutOfStock: "Select items out of stock",
                rejectThisOrder: "Reject this Order",
                viewCustomerNumber: "View Customer Number"
            };
            if (stopAlertSound(),
            $(this).hasClass("reject")) {
                var a = _.template($("#rejectTemplate").html());
                return $("#reject-order-modal").html(a(i)),
                $("#reject-order-modal").openModal({
                    ready: addDialogEventsRej,
                    in_duration: 0
                }),
                window.isModalOpen = 1,
                window.modalTab = t.data("tab-id"),
                !0
            }
            var e, o, i = {
                action: $(this).data("action"),
                tab_id: t.data("tab-id"),
                logistics_partner_id: t.data("logistics-partner-id"),
                comment: null
            }, r = $(".accept").attr("data-delivery-mode");
            $(this).hasClass("accept") && (a = _.template($("#acceptTemplate").html()),
            e = $("#res_id").data("res_id"),
            o = $("#res_id").data("delivery_subzone_id"),
            i.avg_time = $(this).data("avg-time"),
            i.delivery_by_zomato = $(this).data("zomato-fullfilled"),
            i.displayed_kpt = $(this).data("displayed-kpt"),
            i.is_kpt_feature_enabled = n[e],
            $.ajax({
                url: HOST + "php/merchant_ordering_dashboard.php",
                type: "POST",
                data: {
                    method: "check_surge_status",
                    res_id: e,
                    delivery_subzone_id: o
                },
                success: function(e) {
                    return i.deliveryMode = r,
                    i.is_surge_applied = e.is_surge_applied,
                    i.delivery_time = e.delivery_time,
                    i.res_support_tier_wise_ddt = e.res_support_tier_wise_ddt,
                    i.res_takeaway_kpt = e.res_takeaway_kpt,
                    $("#accept-order-modal").html(a(i)),
                    $("#accept-order-modal").openModal({
                        ready: addDialogEventsAcc,
                        in_duration: 0
                    }),
                    window.isModalOpen = 1,
                    window.modalTab = t.data("tab-id"),
                    !0
                }
            })),
            $(this).hasClass("accept") || sendActionRequest(i, t)
        }
        ,
        window.addDispatchReminderPopupEvent = function() {
            $(document).off("click", ".dispatch-no").on("click", ".dispatch-no", function() {
                window.newCloseModal(),
                stopAlertSound();
                var e = $(this).data("tab-id");
                logDispatchPopupData(e, 1, 0)
            }),
            $(document).off("click", ".dispatch-yes").on("click", ".dispatch-yes", function() {
                var e = $(this).data("tab-id");
                logDispatchPopupData(e, 1, 1)
            })
        }
        ,
        window.logDispatchPopupData = function(e, t, a) {
            $.ajax({
                url: HOST + "php/merchant_ordering_dashboard.php",
                type: "POST",
                data: {
                    method: "log-dispatch-popup-data",
                    tab_id: e,
                    dispatch_status: a,
                    dispatch_source: t
                }
            })
        }
        ,
        window.bindDialogActionEvents = function() {
            $("#dialog-body").off("click", ".verify, .reject, .accept").on("click", ".verify, .reject, .accept", addActionButtonEvent),
            $("#dialog-body").off("click", ".submit-return-acknowledgement").on("click", ".submit-return-acknowledgement", submitReturnAcknowledgement),
            $(document).off("click", "#viewAddrOnMap").on("click", "#viewAddrOnMap", function() {
                var e = $(this).data("res_lat")
                  , t = $(this).data("res_long")
                  , a = $(this).data("user_lat")
                  , o = $(this).data("user_long");
                window.newCloseModal();
                var i = {
                    res_latitude: e,
                    res_longitude: t,
                    user_latitude: a,
                    user_longitude: o
                }
                  , r = _.template($("#nonlogs_template").html());
                $("#nonlogs_location-modal").html(r(i)),
                $("#nonlogs_location-modal").openModal({
                    ready: function() {
                        mapApi(i, "nonlogs")
                    },
                    complete: window.newCloseModal
                })
            }),
            addDispatchEvent(),
            addDispatchReminderPopupEvent()
        }
        ,
        window.bindCancelledDialogActionEvents = function() {
            $("#view-cart-modal").off("click", ".dismissCancelledOrder").on("click", ".dismissCancelledOrder", dismissCancelledModal)
        }
        ,
        $(document).off("click", ".comment, .secondary-comment").on("click", ".comment, .secondary-comment", function(e) {
            var t = _.template($("#responseTemplate").html())
              , a = {
                tab_id: $(this).parents(".user-actions").data("tab-id")
            };
            Dialog.show({
                head: "Edit Comments",
                html: t(a),
                onOpen: addDialogEventsUpdateComment
            })
        }),
        $(document).off("click", ".verify, .reject, .accept").on("click", ".verify, .reject, .accept", addActionButtonEvent),
        window.addDispatchPopupEvent = function() {
            $(document).off("click", ".dispatch-popup").on("click", ".dispatch-popup", function(e) {
                var a = {
                    res_id: $(this).data("res_id"),
                    tab_id: $(this).data("tab_id")
                };
                $.ajax({
                    url: HOST + "php/merchant_ordering_dashboard.php",
                    type: "POST",
                    data: {
                        method: "get_riders_list",
                        res_id: a.res_id,
                        tab_id: a.tab_id
                    },
                    success: function(e) {
                        var t;
                        "success" === e.status ? (t = _.template($("#orderDispatchTemplate").html()),
                        $("#dispatch-order-modal").html(t({
                            riders: e.riders,
                            tab_id: a.tab_id
                        })),
                        $("#dispatch-order-modal").openModal({
                            ready: addDialogEventsDispatch,
                            in_duration: 0
                        })) : alert(e.message)
                    }
                })
            })
        }
        ,
        window.addDispatchEvent = function() {
            $(document).off("click", ".dispatch").on("click", ".dispatch", function(e) {
                var t = (o = $(this).parents(".user-actions")).data("tab-id")
                  , a = {
                    tab_id: t,
                    method: "deliverytabresponse",
                    action: "move_to_delivery"
                }
                  , o = $('[data-tab-id="' + t + '"]');
                sendActionRequest(a, o),
                stopAlertSound()
            })
        }
        ,
        $(document).on("change", ".self_delivery_status_switch", function() {
            var e, t, a = $(this), o = a.data("res-id"), i = (a.data("res-name"),
            a.is(":checked") ? 1 : 0);
            0 == i ? (e = _.template($("#statusSelfDeliveryTimeTemplate").html()),
            t = {
                res_id: o,
                self_delivery_status: i,
                localizedTexts: {
                    selfDeliveryOffQuestion: "How long do you want to turn self delivery off for?",
                    minutes15: "15 Minutes",
                    minutes30: "30 Minutes",
                    hour1: "1 Hour",
                    hour2: "2 Hours",
                    hour4: "4 Hours",
                    hours6: "6 Hours",
                    day1: "1 Day",
                    turnOffButton: "Turn Off"
                }
            },
            $("#status-time-modal").html(e(t)),
            $("#status-time-modal").openModal({
                ready: setSelfDeliveryStatusTime,
                dismissible: !1
            })) : $.ajax({
                url: HOST + "php/merchant_ordering_dashboard.php",
                type: "POST",
                data: {
                    method: "set_self_delivery_status",
                    res_id: o,
                    status: i
                },
                success: function(e) {
                    "success" === e.status && (d[o] = !!i,
                    changeSelfDeliveryBannerText(),
                    alert(e.message),
                    window.newCloseModal())
                }
            })
        }),
        $(document).on("change", ".take_away_status_switch", function() {
            var e = $(this)
              , t = e.data("res-id")
              , a = (e.data("res-name"),
            e.is(":checked") ? 1 : 0);
            $.ajax({
                url: HOST + "php/merchant_ordering_dashboard.php",
                type: "POST",
                data: {
                    method: "set_take_away_status_pwa",
                    res_id: t,
                    status: a,
                    from: "web"
                },
                success: function() {}
            })
        }),
        $(document).on("change", ".delivery_status_switch", function() {
            var e, t, o = $(this).data("res-id"), i = $(this).is(":checked") ? 1 : 0;
            0 == i ? (e = _.template($("#statusTimeTemplate").html()),
            t = {
                res_id: o,
                delivery_status: i,
                localizedTexts: {
                    offlineDurationQuestion: "How long do you want to go offline for?",
                    minutes30: "30 Minutes",
                    hour1: "1 Hour",
                    hours6: "6 Hours",
                    day1: "1 Day",
                    days2: "2 Days",
                    goOfflineButton: "Go Offline"
                }
            },
            $("#status-time-modal").html(e(t)),
            $("#status-time-modal").openModal({
                ready: setStatusTime,
                dismissible: !1
            })) : $.ajax({
                url: HOST + "php/merchant_ordering_dashboard.php",
                type: "POST",
                data: {
                    method: "set_delivery_status_pwa",
                    res_id: o,
                    status: i,
                    from: "web"
                },
                success: function(e) {
                    "success" === e.status && $.ajax({
                        url: HOST + "php/merchant_ordering_dashboard.php",
                        type: "POST",
                        data: {
                            method: "get_surge_status",
                            delivery_status: i,
                            res_id: o
                        },
                        success: function(e) {
                            var t, a;
                            "success" === e.status && (a = "#surge_status_",
                            t = (t = "#surge_timings_").concat(o),
                            a = a.concat(o),
                            i ? e.surge_status ? ($(a).show(),
                            $(t).hide()) : ($(t).show(),
                            $(a).hide()) : ($(a).hide(),
                            $(t).hide()))
                        }
                    })
                }
            })
        }),
        $(document).on("click", ".update_surge", function() {
            var e = this.value
              , t = "#surge_status_" + e;
            $("#surge_timings_" + e).show(),
            $(t).hide()
        }),
        $(document).off("click", ".create_ticket").on("click", ".create_ticket", function(e) {
            e.preventDefault();
            var t = $("#create_ticket_dropdown").attr("create_ticket_url")
              , a = {
                res_id: $(this).attr("res_id"),
                res_name: $(this).attr("res_name"),
                source_app: "merchant web dashboard",
                city_name: $(this).attr("city_name"),
                am_name: $(this).attr("am_name")
            };
            r(t + "&info=" + (a = btoa(JSON.stringify(a))))
        }),
        $(document).off("click", ".raise_issue_button").on("click", ".raise_issue_button", function(e) {
            var t, a, o;
            e.preventDefault(),
            1 == parseInt($(this).attr("show-alert")) ? (t = $(this).attr("alert-text"),
            alert(t)) : (a = $("#order_ticket_url").attr("order_ticket_url"),
            o = {
                res_id: $(this).attr("res_id"),
                res_name: $(this).attr("res_name"),
                source_app: "merchant web dashboard",
                city_name: $(this).attr("city_name"),
                order_id: $(this).parents(".user-actions").data("tab-id"),
                user_name: $(this).attr("user_name"),
                fe_name: $(this).attr("delivery_boy_name"),
                fe_number: $(this).attr("delivery_boy_number"),
                logistics_order: 1 == $(this).attr("is_log_order") ? "Yes" : "No",
                order_time: $(this).attr("order_time"),
                delivery_time: $(this).attr("delivery_time"),
                am_name: $(this).attr("am_name")
            },
            r(a + "&info=" + (o = btoa(JSON.stringify(o)))))
        }),
        $(".view_tickets").on("click", function(e) {
            e.preventDefault();
            var t = $("#view_tickets_dropdown").attr("view_tickets_url")
              , a = {
                res_id: $(this).attr("res_id")
            };
            r(t = t + "?info=" + (a = btoa(JSON.stringify(a))))
        }),
        $(document).on("click", ".cancel_surge", function() {
            var e = this.value
              , t = "#surge_status_" + e;
            $("#surge_timings_" + e).hide(),
            $(t).show()
        }),
        $(document).off("click", ".video_tutorial").on("click", ".video_tutorial", function(e) {
            e.preventDefault(),
            $(".video_tutorial").data("data_fetched") || $.ajax({
                url: HOST + "php/merchant_ordering_dashboard.php?device_type=4",
                type: "POST",
                data: {
                    method: "merchant_video_data",
                    resIds: window.resIdsList.join()
                },
                success: function(e) {
                    var t, a;
                    "success" === e.status && (t = _.template($("#video_tutorial_template").html()),
                    a = {
                        videos: e.videos_data
                    },
                    $(".video_tutorial").data("data_fetched", !0),
                    $("#video_tutorial_modal").html(t(a)))
                }
            }),
            $("#video_tutorial_modal").openModal()
        }),
        $(document).on("click", ".reset_surge", function() {
            var e = this.value;
            $.ajax({
                url: HOST + "php/merchant_ordering_dashboard.php",
                type: "POST",
                data: {
                    method: "reset_delivery_status",
                    res_id: e
                },
                success: function(e) {
                    "success" === e.status && (alert(e.message),
                    window.newCloseModal())
                }
            })
        }),
        $(document).on("click", ".tier_update_surge", function() {
            var e, t, a = this.value;
            void 0 !== l.surge_data && 0 != Object.keys(l.surge_data).length && (e = _.template($("#changeDDTTemplate").html()),
            t = {
                res_id: a,
                surge_data: l.surge_data
            },
            $("#change-ddt-modal").html(e(t)),
            $("#change-ddt-modal").openModal({
                dismissible: !0
            }))
        }),
        $(document).on("click", ".tier_cancel_surge", function() {
            this.value;
            $("#change-ddt-modal").closeModal()
        }),
        window.setStatusTime = function() {
            $("#status-time-modal").css({
                top: "21%"
            }),
            $("#status-time-modal").css("height", "48%"),
            $("#status-time-modal").css("width", "50%"),
            $(".modal").off("click", ".status_time_accept").on("click", ".status_time_accept", function() {
                var e = $(this).data("res_id")
                  , t = $("input[name='status_time']:checked").val()
                  , a = $(this).data("delivery_status");
                $.ajax({
                    url: HOST + "php/merchant_ordering_dashboard.php",
                    type: "POST",
                    data: {
                        method: "set_delivery_status_pwa",
                        res_id: e,
                        status: a,
                        time: t,
                        from: "web"
                    },
                    success: function(e) {
                        "success" === e.status && (alert(e.message),
                        window.newCloseModal())
                    }
                })
            })
        }
        ,
        window.setSelfDeliveryStatusTime = function() {
            $("#status-time-modal").css({
                top: "21%",
                height: "48%",
                width: "50%"
            }),
            $(".modal").off("click", ".status_time_accept").on("click", ".status_time_accept", function() {
                var t = $(this).data("res_id")
                  , e = $("input[name='status_time']:checked").val()
                  , a = $(this).data("self_delivery_status");
                $.ajax({
                    url: HOST + "php/merchant_ordering_dashboard.php",
                    type: "POST",
                    data: {
                        method: "set_self_delivery_status",
                        res_id: t,
                        status: a,
                        time: e
                    },
                    success: function(e) {
                        "success" === e.status && (d[t] = !!a,
                        changeSelfDeliveryBannerText(),
                        alert(e.message),
                        window.newCloseModal())
                    }
                })
            })
        }
        ,
        window.changeSelfDeliveryBannerText = function() {
            var e = 0
              , t = "";
            for (var a in d)
                d[a] || (t = o[a],
                e++);
            0 < e ? 1 === e ? $("#self_delivery_banner").show().text("Self Delivery Off - " + t) : $("#self_delivery_banner").show().text("Self Delivery Off - " + e + " Outlets") : $("#self_delivery_banner").hide()
        }
        ,
        window.bindDeliveryStatusUpdateEvents = function() {
            $("#delivery-status-modal").css({
                top: "21%"
            }),
            $("#delivery-status-modal").css("height", "65%"),
            $("#delivery-status-modal").css("width", "60%"),
            $("#delivery-status-modal").css("overflow-y", "auto"),
            $(".modal").off("click", ".delivery_status_button").on("click", ".delivery_status_button", function() {
                var n = {}
                  , s = {}
                  , d = {};
                $(".delivery_status_switch").each(function() {
                    var e = $(this).data("res-id");
                    n[e] = $(this).is(":checked") ? 1 : 0,
                    d[e] = $(this).is(":checked") ? 1 : 0;
                    var t = "#tier_surge_timings_" + e
                      , a = 0
                      , o = 0
                      , i = 0;
                    $("#surge_timings_" + e).is(":visible") ? (a = 1,
                    o = $("#delivery_time_" + e).val(),
                    i = $("#surge_duration_" + e).val()) : $(t).is(":visible") && (a = 1,
                    o = $("#tier_delivery_time_" + e).val(),
                    i = $("#tier_surge_duration_" + e).val());
                    var r = {};
                    r.surge_status = a,
                    r.delivery_time = o,
                    r.surge_duration = i,
                    s[e] = r
                }),
                $.ajax({
                    url: HOST + "php/merchant_ordering_dashboard.php",
                    type: "POST",
                    data: {
                        method: "set_delivery_status",
                        delivery_status_list: n,
                        self_delivery_status_list: d,
                        surge_info: s
                    },
                    success: function(e) {
                        "success" === e.status && (alert(e.message),
                        window.newCloseModal())
                    }
                })
            })
        }
        ,
        $(document).off("click", ".comments_icon").on("click", ".comments_icon", function(e) {
            e.preventDefault();
            var t = $(this).data("tab_id");
            $ctrl = $(this),
            $.ajax({
                url: HOST + "php/merchant_ordering_dashboard.php",
                type: "POST",
                data: {
                    method: "showAddComment",
                    tab_id: t
                },
                success: function(e) {
                    var t;
                    "success" == e.status ? (e = {
                        html: e.html,
                        localizedTexts: {
                            comments: "COMMENTS"
                        }
                    },
                    t = _.template($("#commentTemplate").html()),
                    $("#comments-modal").html(t(e)),
                    $("#comments-modal").openModal({
                        ready: add_comments_to_db
                    })) : alert(e.message)
                }
            })
        }),
        window.add_comments_to_db = function() {
            $(".modal").off("click", ".merchant-comment").on("click", ".merchant-comment", function(e) {
                $(this).prop("contentEditable", "true")
            }),
            $(".modal").off("click", "input#update-merchant-comment").on("click", "input#update-merchant-comment", function(e) {
                var t = $(this).data("comment_id")
                  , a = $(".merchant-comment").text();
                $.ajax({
                    url: HOST + "php/merchant_ordering_dashboard.php",
                    type: "POST",
                    data: {
                        method: "editComment",
                        comment_id: t,
                        comment: a
                    },
                    success: function(e) {
                        "success" == e.status ? (alert(e.message),
                        $("#comments-modal").closeModal()) : alert(e.message)
                    }
                })
            }),
            $(".modal").off("click", ".add_comments_to_db").on("click", ".add_comments_to_db", function(e) {
                e.preventDefault();
                var t = $(this).data("tab_id")
                  , a = $(".comment_text_area").val();
                $ctrl = $(this),
                $.ajax({
                    url: HOST + "php/merchant_ordering_dashboard.php",
                    type: "POST",
                    data: {
                        method: "addComment",
                        tab_id: t,
                        comments: a
                    },
                    success: function(e) {
                        "success" == e.status ? (alert(e.message),
                        $("#comments-modal").closeModal()) : alert(e.message)
                    }
                })
            })
        }
        ,
        $(document).off("click", "#settingButton").on("click", "#settingButton", function() {
            var e = window.resIdsList.join()
              , s = "Show full list";
            $.ajax({
                url: HOST + "php/merchant_ordering_dashboard.php",
                type: "POST",
                data: {
                    method: "get_delivery_status",
                    resIds: e
                },
                success: function(e) {
                    if ("success" === e.status) {
                        var t = $.parseJSON(e.takeaway_is_active)
                          , a = e.surge_data
                          , e = {
                            delivery_status_list: $.parseJSON(e.delivery_status_list),
                            self_delivery_status_list: $.parseJSON(e.self_delivery_status_list),
                            resNames: window.resNamesObj,
                            surge_data: e.surge_data,
                            take_away_status: $.parseJSON(e.take_away_status),
                            takeaway_is_active: t,
                            showPickup: function(e) {
                                var t = !1;
                                for (var a in e)
                                    e.hasOwnProperty(a) && Boolean(e[a]) && (t = !0);
                                return t
                            }(t)
                        };
                        d = e.self_delivery_status_list,
                        changeSelfDeliveryBannerText(),
                        (l = e).localizedTexts = {
                            pickup: "Pickup",
                            online: "Online",
                            selfDelivery: "Self Delivery",
                            deliveryStatus: "Delivery Status",
                            onStatus: "On",
                            offStatus: "Off"
                        };
                        var o = _.template($("#deliveryStatusTemplate").html());
                        $("#delivery-status-modal").html(o(e)),
                        $("#delivery-status-modal").openModal({
                            ready: bindDeliveryStatusUpdateEvents,
                            complete: window.newCloseModal
                        }),
                        window.isModalOpen = 1;
                        for (var i = "#surge_timings_", r = "#surge_status_", n = resIdsList.length - 1; 0 <= n; n--)
                            e.delivery_status_list[resIdsList[n]] ? a[resIdsList[n]] ? ($(i.concat(resIdsList[n])).hide(),
                            $(r.concat(resIdsList[n])).show()) : ($(i.concat(resIdsList[n])).show(),
                            $(r.concat(resIdsList[n])).hide()) : ($(i.concat(resIdsList[n])).hide(),
                            $(r.concat(resIdsList[n])).hide());
                        $(".see_full_list").each(function() {
                            var e, t = $(this).html().trim();
                            75 < (t = t.replace(/  /g, "")).length && (e = t.substr(0, 75) + '<span class="moreellipses">...&nbsp;</span><span class="morecontent"><span>' + t.substr(75, t.length - 75) + '</span>&nbsp;&nbsp;<a href="" class="morelink" style="text-align: right;padding-right: 10px;">' + s + "</a></span>",
                            $(this).html(e))
                        }),
                        $(".morelink").click(function() {
                            return $(this).hasClass("less") ? ($(this).removeClass("less"),
                            $(this).html(s)) : ($(this).addClass("less"),
                            $(this).html("Show less")),
                            $(this).parent().prev().toggle(),
                            $(this).prev().toggle(),
                            !1
                        })
                    }
                }
            })
        }),
        window.showDispatchButton = setInterval(function() {
            $(".dispatch").each(function() {
                window.current_time > $(this).data("dispatch-time") && 0 != $(this).data("dispatch-time") && $(this).show()
            })
        }, 1e4),
        window.updateCurrentTime = setInterval(function() {
            window.current_time = window.current_time + 1
        }, 1e3),
        $(document).off("click", ".view-cart").on("click", ".view-cart", function() {
            var r = $(this).data("res_id")
              , n = $(this).parents(".user-actions").data("tab-id");
            $.ajax({
                url: HOST + "php/merchant_ordering_dashboard.php",
                type: "POST",
                data: {
                    res_id: r,
                    tab_id: n,
                    method: "orderdetail"
                },
                success: function(e) {
                    var t = 1 == e.tab.isDeliveredByZomato ? 1 : 0
                      , a = {
                        tab_id: n,
                        res_id: r,
                        order_items: e.tab.items,
                        status: e.tab.status,
                        delivery_status: e.tab.delivery_status,
                        currency: e.currency,
                        user_name: e.tab.name,
                        phone: e.tab.userPhone,
                        address: e.tab.deliveryAddress,
                        payment_block_class: e.tab.payment_block_class,
                        payment_affix: e.tab.payment_affix,
                        creator_orders_count: e.tab.creator_orders_count,
                        add_inst: null != e.tab.address_instructions ? e.tab.address_instructions : "Not Specified",
                        spcl_inst: null != e.tab.specialInstructions ? e.tab.specialInstructions : "Not Specified",
                        deliveryMode: e.tab.deliveryMode,
                        return_state: e.tab.return_info && e.tab.return_info.state ? e.tab.return_info.state : "",
                        return_rejection_message: e.tab.return_info && e.tab.return_info.rejectionReasonMessage ? e.tab.return_info.rejectionReasonMessage : "",
                        return_otp: e.tab.return_info && e.tab.return_info.otp ? e.tab.return_info.otp : 0,
                        rider_message: e.tab.return_info && e.tab.return_info.riderMessage ? e.tab.return_info.riderMessage : "",
                        delivered_by_zomato: e.tab.isDeliveredByZomato,
                        user_count_from_same_res: e.tab.user_count_from_same_res,
                        distance_from_res: e.tab.distance,
                        res_details: e.tab.res_details,
                        res_avg_time: e.tab.res_avg_time,
                        show_new_user_info: e.tab.show_new_user_info,
                        rejection_queued: e.tab.rejection_queued,
                        logistics_partner_id: t,
                        is_trace_enabled: e.tab.is_trace_enabled,
                        res_riders: e.tab.riders,
                        dispatch_popup: 0,
                        show_dispatch_button_time: e.tab.show_dispatch_button_time,
                        should_show_dispatch_button: e.tab.should_show_dispatch_button,
                        delivery_subzone_id: e.tab.delivery_subzone_id,
                        country_id: e.tab.country_id,
                        hybrid_order: e.tab.hybrid_order,
                        displayed_kpt: e.tab.displayed_kpt ? e.tab.displayed_kpt : 0,
                        prepare_by: e.tab.prepare_by || "",
                        cust_pickup_time: e.tab.cust_pickup_time,
                        cust_pickup_time_including_kpt: e.tab.cust_pickup_time_including_kpt,
                        collect_cash: e.tab.collect_cash,
                        res_lat: e.tab.res_lat,
                        res_long: e.tab.res_long,
                        user_lat: e.tab.user_lat,
                        user_long: e.tab.user_long,
                        otp: e.tab.otp,
                        order_messages: e.tab.order_messages,
                        rbt: e.tab.rbt
                    };
                    a.distance_from_res = Math.round(a.distance_from_res);
                    var o = s({
                        orderId: "ORDER ID",
                        noCashToBeCollectd: "No Cash to be collected",
                        cashToBeCollected: "Cash to be collected",
                        dispatchReminder: "DISPATCH REMINDER",
                        minutesLeftForDelivery: "minutes left for delivery",
                        print: "print",
                        runnrAvailable: "RUNNR AVAILABLE",
                        runnrNotAvailable: "RUNNR NOT AVAILABLE",
                        pickupOrder: "Pickup Order",
                        totalOrdersFromYourRes: "Total Orders from your restaurant",
                        otp: "OTP",
                        customerPickupTime: "Customer Pickup Time",
                        address: "Address",
                        deliveryInstructions: "Delivery Instructions",
                        specialCookingInstructions: "Special Cooking Instructions",
                        buyOneGetOneOfferApplied: "Buy one get one offer applied",
                        acceptOrder: "Accept Order",
                        rejectOrder: "Reject Order",
                        verifyId: "Verify ID",
                        okButton: "Ok",
                        hasTheOrderBeenDispatched: "Has this order been dispatched",
                        yes: "Yes",
                        no: "No",
                        dispatch: "Dispatch",
                        readyToPickup: "Ready to pickup"
                    }, "address", "Address");
                    a.localizedTexts = o;
                    var i = _.template($("#orderTemplate").html());
                    $("#view-cart-modal").html(i(a)),
                    $("#view-cart-modal").openModal({
                        ready: bindDialogActionEvents,
                        complete: window.newCloseModal
                    }),
                    window.isModalOpen = 1,
                    window.modalTab = n
                }
            })
        }),
        window.mapApi = function(l, e) {
            var t, a, o, c, m, p;
            0 !== $("#map-canvas").length && (map = L.map("map-canvas", {
                zoomControl: !1,
                touchZoom: !0,
                zoom: 13,
                scrollWheelZoom: !1,
                maxZoom: 18,
                doubleClickZoom: !1,
                keyboard: !1
            }),
            (t = L.control.attribution({
                position: "bottomleft"
            })).addAttribution('&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'),
            map.addControl(t),
            map.attributionControl.setPrefix(""),
            map.addControl(L.control.zoom({
                position: "bottomright"
            })),
            o = (a = "https://maps.zomato.com/") + "osm/{z}/{x}/{y}.png",
            1.5 < window.devicePixelRatio && (o = a + "osm_retina/{z}/{x}/{y}.png"),
            L.tileLayer(o, {
                detectRetina: !0
            }).addTo(map),
            c = {},
            m = {},
            p = function(e, t) {
                var a = e
                  , o = L.icon({
                    iconUrl: t[e][3],
                    iconAnchor: [10, 10]
                })
                  , i = new L.latLng(parseFloat(t[e][1]),parseFloat(t[e][2]));
                return markerPos = L.marker(i, {
                    icon: o,
                    title: t[e][4]
                }),
                markerPos.bindPopup("<strong>" + t[e][4] + "</strong>"),
                markerPos.addTo(map),
                m[a] = i,
                c[a] = markerPos,
                markerPos
            }
            ,
            "logs" == e && function s() {
                var d;
                $.ajax({
                    url: HOST + "php/merchant_ordering_dashboard.php",
                    type: "POST",
                    data: {
                        res_id: l.res_id,
                        tab_id: l.tab_id,
                        method: "order_tracking"
                    },
                    success: function(e) {
                        if ($(".runnr_eta").html(""),
                        e.mapErrorMessage)
                            return clearTimeout(u),
                            alert(e.mapErrorMessage),
                            void window.newCloseModal();
                        d = e.pollingFrequency,
                        e.eta && e.eta.display_text && $(".runnr_eta").html("Runner will reach in " + e.eta.display_text);
                        var t = ["rider", parseFloat(e.rider.latitude), parseFloat(e.rider.longitude), CDN + "images/bike_small.png", "Rider"]
                          , a = ["home", parseFloat(l.delivery_latitude), parseFloat(l.delivery_longitude), CDN + "images/home_marker_v2.svg", "Drop"]
                          , o = [t, ["rest", parseFloat(l.res_latitude), parseFloat(l.res_longitude), CDN + "images/restaurant_marker_v2.svg", "Restaurant"], a];
                        $("#riderMapLink").attr("href", "https://www.google.com/maps/dir/?api=1&origin=" + o[0][1] + "," + o[0][2] + "&destination=" + o[2][1] + "," + o[2][2] + "&travelmode=driving&waypoints=" + o[1][1] + "," + o[1][2]);
                        for (var i, r = 0; r < o.length; r++)
                            "rider" === o[r][0] ? ((i = c[r]) && map.removeLayer(i),
                            p(r, o)) : c[r] || p(r, o);
                        var n = L.latLngBounds(m[0], m[2]);
                        u || map.fitBounds(n, {
                            padding: [50, 50]
                        }),
                        d && (u = setTimeout(s, 1e3 * d))
                    }
                })
            }(),
            "nonlogs" === e && function() {
                $(".runnr_eta").html("");
                for (var e = ["home", parseFloat(l.user_latitude), parseFloat(l.user_longitude), CDN + "images/home_marker_v2.svg"], t = [["rest", parseFloat(l.res_latitude), parseFloat(l.res_longitude), CDN + "images/restaurant_marker_v2.svg"], e], a = 0; a < t.length; a++)
                    c[a] || p(a, t);
                var o = L.latLngBounds(m[0], m[1]);
                map.fitBounds(o, {
                    padding: [50, 50]
                })
            }())
        }
        ,
        window.getNotifications = function() {
            $.ajax({
                url: HOST + "php/merchant_ordering_dashboard.php",
                type: "POST",
                data: {
                    method: "get_notifications_web"
                },
                success: function(e) {
                    "success" === e.status && (window.notifications = e.notifications,
                    createDefaultBanners(window.notifications))
                }
            })
        }
        ,
        window.createDefaultBanners = function e(t) {
            var a, o = t.pop();
            o && (a = _.template($("#def_banner_tmpl").html()),
            modalCnt = $("#default_banner-modal"),
            modalCnt.html(a({
                heading: o.heading,
                text: o.text.replace(/(?:\r\n|\r|\n)/g, "<br>"),
                notif_id: o.id,
                dismissible: o.dismissible,
                action_btn_lbl: o.action_btn_lbl,
                reject_btn_lbl: o.reject_btn_lbl
            })),
            modalCnt.openModal({
                ready: defaultBannerCallback,
                complete: function() {
                    e(t)
                }
            }))
        }
        ,
        window.defaultBannerCallback = function() {
            $("#default_banner-modal").off("click", ".okay, .confirm, .dismiss").on("click", ".okay, .confirm, .dismiss", readNotificationCallback),
            $("#default_banner-modal").off("click", ".close").on("click", ".close", function() {
                window.newCloseModal(),
                createDefaultBanners(window.notifications)
            })
        }
        ,
        window.readNotificationCallback = function(e) {
            var t = $(e.target)
              , a = t.attr("data-id");
            action_id = t.attr("data-action_id"),
            markNotificationAsRead(a, action_id),
            window.newCloseModal(),
            createDefaultBanners(window.notifications)
        }
        ,
        window.markNotificationAsRead = function(e, t) {
            $.ajax({
                url: HOST + "php/merchant_ordering_dashboard.php",
                type: "POST",
                data: {
                    notif_id: e,
                    action: t,
                    method: "mark_read_notif_usr"
                },
                success: function() {}
            })
        }
        ,
        $(document).off("click", ".order_filters").on("click", ".order_filters", function() {
            var e = $(this);
            "pickup" == e.children().val() ? (e.children().prop("checked", !0),
            $(".takeaway_order").css({
                display: "block"
            }),
            $(".delivery_order").css({
                display: "none"
            })) : "delivery" == e.children().val() ? (e.children().prop("checked", !0),
            $(".takeaway_order").css({
                display: "none"
            }),
            $(".delivery_order").css({
                display: "block"
            })) : (e.children().prop("checked", !0),
            $(".takeaway_order, .delivery_order").css({
                display: "block"
            }))
        }),
        $(document).off("click", ".runnr_location").on("click", ".runnr_location", function() {
            var e = $(this).data("res_id")
              , t = $(this).parents(".user-actions").data("tab-id")
              , a = $(this).data("delivery_boy_name")
              , o = $(this).data("delivery_boy_number")
              , i = $(this).data("order_prep_time")
              , r = $(this).data("res_latitude")
              , n = $(this).data("res_longitude")
              , s = $(this).data("delivery_latitude")
              , d = $(this).data("delivery_longitude")
              , l = {
                res_latitude: r,
                res_longitude: n,
                delivery_longitude: d,
                delivery_latitude: s,
                res_id: e,
                tab_id: t
            }
              , c = {
                res_id: e,
                tab_id: t,
                delivery_boy_name: a,
                delivery_boy_number: o,
                order_prep_time: i,
                res_latitude: r,
                res_longitude: n,
                delivery_longitude: d,
                delivery_latitude: s
            }
              , m = _.template($("#runnr_location_template").html());
            $("#runnr_location-modal").html(m(c)),
            $("#runnr_location-modal").openModal({
                ready: function() {
                    mapApi(l, "logs")
                },
                complete: window.newCloseModal
            }),
            window.modalTab = t,
            window.isModalOpen = 1
        }),
        window.getRejectMessage = function(o) {
            var e = (o = $(o)).parents(".user-actions");
            $.ajax({
                url: HOST + "php/ordering_dashboard.php",
                type: "POST",
                data: {
                    action: "get-reject-msg",
                    tab_id: e.data("tab-id")
                },
                success: function(e) {
                    var t = '<select class="reject-reasons">';
                    for (var a in e)
                        t += '<option data-msg_id="' + e[a].id + '">' + e[a].text + "</option>";
                    t += "</select>",
                    o.before(t),
                    o.html("Confirm Reject Reason"),
                    o.addClass("reject-msg-sel")
                }
            })
        }
        ,
        window.showPhoneNumber = function(t, a, o) {
            $.ajax({
                url: HOST + "php/merchant_ordering_dashboard.php",
                type: "POST",
                data: {
                    method: "view_phone_number",
                    tab_id: a,
                    csrfToken: zomato.csrft
                },
                success: function(e) {
                    "success" === e.status && (t.siblings(".show-number").text("Ph: " + e.number),
                    t.remove(),
                    "OOS_call_customer" === o && sendToJumbo("jevent", {
                        ename: o,
                        var1: $("#res_id").data("res_id"),
                        var2: a,
                        var3: "MERCHANT_WEB"
                    }))
                }
            })
        }
        ,
        window.showRejectOrder = function(e) {
            var t = _.template($("#rejectTemplate").html())
              , a = {
                tab_id: e,
                overlay_header: "Reject Order"
            };
            return a.localizedTexts = {
                reasonToReject: "Reason to Reject",
                selectReasonToReject: "Please select a reason for rejecting the order.",
                selectItemOutOfStock: "Select items out of stock",
                rejectThisOrder: "Reject this Order",
                viewCustomerNumber: "View Customer Number"
            },
            $("#reject-order-modal").html(t(a)),
            $("#reject-order-modal").openModal({
                ready: addDialogEventsRej,
                in_duration: 0
            }),
            window.isModalOpen = 1,
            window.modalTab = e,
            !0
        }
        ,
        window.getRejectionPenalty = function(e, t) {
            var a = Math.floor((Date.now() - new Date(t).getTime()) / 1e3)
              , o = {};
            for (var i in e) {
                var r = e[i];
                +r.start_duration <= a && +r.end_duration > a && (o = r)
            }
            return o
        }
        ,
        window.confirmOrderRejection = function(e) {
            var t = $("#rejectionPenalty");
            return $("#reject-order-modal .reject-order-header").text("Penalty Amount Updated"),
            $("#reject-order-modal .user-actions").find(".confirm-reject").text("Confirm Rejection").blur(),
            $("#rejectionOptions").hide(),
            t.data("penaltyAmount", e.penalty_amount || 0),
            t.html("<div>" + _.values(c(e, "message", [])).join(", ") + "</div>"),
            window.isModalOpen = 1,
            !0
        }
        ,
        window.submitRBTData = function(e, t, a, o, i, r) {
            $.ajax({
                url: HOST + "php/merchant_ordering_dashboard.php",
                type: "POST",
                async: !1,
                data: {
                    method: "submit_rbt_data",
                    order_id: e,
                    is_high_temp: t ? "high_temp" : "normal",
                    rbt: a,
                    rider_phone: 0,
                    res_id: o
                },
                success: function(e) {
                    "success" == e.status ? (console.log(e.message),
                    i()) : "failed" == e.status && (console.log(e.message),
                    r())
                }
            })
        }
        ,
        window.submitReturnAcknowledgement = function() {
            var t = $(this).parents(".user-actions").data("tab-id");
            $.ajax({
                url: HOST + "php/merchant_ordering_dashboard.php",
                type: "POST",
                async: !1,
                data: {
                    method: "ack_order_return",
                    tab_id: t
                },
                success: function(e) {
                    "success" == e.status ? (console.log(e.message),
                    $("#view-cart-modal").hide(),
                    $(".lean-overlay").remove()) : "failed" == e.status && console.log(e.message),
                    window.closeReturnedModal(t)
                }
            })
        }
        ,
        window.sendRBTFeverData = function() {
            var a = window.rbtTargetEl
              , o = parseFloat($(".rbt-temp-val").text())
              , e = $(a).parent().parent().parent().attr("data-tab_id")
              , t = $(a).parent().parent().parent().attr("data-res_id");
            console.log({
                orderId: e,
                resId: t,
                riderTemperature: o
            });
            var i = 99 < o;
            window.submitRBTData(e, i, o, t, function() {
                var e, t;
                $(a).parent().parent().hide(),
                99 < o ? $(a).parent().parent().parent().find(".rbt-negative-flow").show() : ($(a).parent().parent().parent().find(".rbt-happy-flow").show(),
                t = (e = $(a).parent().parent().parent().siblings(".rider-otp-container").find(".rider-otp")).attr("data-rider_otp"),
                e.html(t)),
                window.newCloseModal()
            }, function() {
                console.log("something went wrong, plz try again")
            })
        }
        ,
        window.confirmRBT = function(e) {
            window.rbtTargetEl;
            var t = parseFloat($(".rbt-temp-val").text());
            t < 99 ? sendRBTFeverData(e) : ($(".rbt-modal-temp-btns").hide(),
            $(".submit-rider-fever-btn").hide(),
            $(".rbt-confirmation-screen").show(),
            $(".confirmed-temp-val").text(t + "℉ (Fever)"),
            $(".rbt-confirm-submit-btns").show(),
            console.log("setting modal header"),
            $(".modal-title").html("Rider Temperature " + t + " ℉"))
        }
        ,
        window.recordAgain = function() {
            $(".rbt-modal-temp-btns").show(),
            $(".submit-rider-fever-btn").show(),
            $(".rbt-confirmation-screen").hide(),
            $(".rbt-confirm-submit-btns").hide(),
            $(".modal-title").html("Set Rider's temperature")
        }
        ,
        window.showRbtModal = function(e) {
            var t = _.template($("#rbtModalTemplate").html());
            return $("#rbt-modal").html(t({
                overlay_header: "Set Rider's temperature"
            })),
            $("#rbt-modal").openModal({
                ready: function() {
                    console.log("rbt modal ready")
                },
                in_duration: 0
            }),
            window.rbtTargetEl = e,
            window.isModalOpen = 1,
            !(window.modalTab = 0)
        }
        ,
        window.openFeverModal = function(e) {
            var t = e.target;
            $(t).parent().parent().attr("data-rider-fever", 1),
            console.log("opening fever modal"),
            showRbtModal(t)
        }
        ,
        $(document).off("click", ".rbt-red-btn").on("click", ".rbt-red-btn", openFeverModal),
        window.changeRbtTemp = function(e, t) {
            var a = e.target
              , o = $(a).parent().find(".rbt-temp-val");
            window.rbtValEl = o;
            var i = parseFloat(parseFloat(o.text()) + t).toFixed(1)
              , i = Math.min(Math.max(i, 95), 103);
            o.html(i)
        }
        ,
        $(".modal").off("click", ".decrease-rbt-temp").on("click", ".decrease-rbt-temp", function(e) {
            changeRbtTemp(e, -.2)
        }),
        $(".modal").off("click", ".increase-rbt-temp").on("click", ".increase-rbt-temp", function(e) {
            changeRbtTemp(e, .2)
        }),
        $(".modal").off("click", ".submit-rider-fever-btn").on("click", ".submit-rider-fever-btn", confirmRBT),
        $(".modal").off("click", ".submit-return-acknowledgement").on("click", ".submit-return-acknowledgement", submitReturnAcknowledgement),
        $(".modal").off("click", ".rbt-confirm-record-again-btn").on("click", ".rbt-confirm-record-again-btn", recordAgain),
        $(".modal").off("click", ".rbt-confirm-assign-new-rider-btn").on("click", ".rbt-confirm-assign-new-rider-btn", sendRBTFeverData);
        function m(e, t) {
            var a = e.target
              , o = $(a).parent().parent().parent().parent().attr("data-tab_id");
            $.ajax({
                url: HOST + "php/merchant_ordering_dashboard.php",
                type: "POST",
                async: !1,
                data: {
                    method: "submit_rider_wearing_mask_data",
                    order_id: o,
                    is_rider_wearing_mask: t ? "Yes" : "No"
                },
                success: function(e) {
                    "success" == e.status ? (console.log(e.message),
                    $(a).parent().parent().hide(),
                    t ? $(a).parent().parent().parent().find(".facemask-happy-flow").show() : $(a).parent().parent().parent().find(".facemask-negative-flow").show()) : "failed" == e.status && (console.log(e.message),
                    console.log("something went wrong"))
                }
            })
        }
        $(document).off("click", ".facemask-green-btn").on("click", ".facemask-green-btn", function(e) {
            m(e, !0)
        }),
        $(document).off("click", ".facemask-red-btn").on("click", ".facemask-red-btn", function(e) {
            m(e, !1)
        })
    }
});
;//     Underscore.js 1.7.0
//     http://underscorejs.org
//     (c) 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.
(function() {
    var n = this
      , t = n._
      , r = Array.prototype
      , e = Object.prototype
      , u = Function.prototype
      , i = r.push
      , a = r.slice
      , o = r.concat
      , l = e.toString
      , c = e.hasOwnProperty
      , f = Array.isArray
      , s = Object.keys
      , p = u.bind
      , h = function(n) {
        return n instanceof h ? n : this instanceof h ? void (this._wrapped = n) : new h(n)
    };
    "undefined" != typeof exports ? ("undefined" != typeof module && module.exports && (exports = module.exports = h),
    exports._ = h) : n._ = h,
    h.VERSION = "1.7.0";
    var g = function(n, t, r) {
        if (t === void 0)
            return n;
        switch (null == r ? 3 : r) {
        case 1:
            return function(r) {
                return n.call(t, r)
            }
            ;
        case 2:
            return function(r, e) {
                return n.call(t, r, e)
            }
            ;
        case 3:
            return function(r, e, u) {
                return n.call(t, r, e, u)
            }
            ;
        case 4:
            return function(r, e, u, i) {
                return n.call(t, r, e, u, i)
            }
        }
        return function() {
            return n.apply(t, arguments)
        }
    };
    h.iteratee = function(n, t, r) {
        return null == n ? h.identity : h.isFunction(n) ? g(n, t, r) : h.isObject(n) ? h.matches(n) : h.property(n)
    }
    ,
    h.each = h.forEach = function(n, t, r) {
        if (null == n)
            return n;
        t = g(t, r);
        var e, u = n.length;
        if (u === +u)
            for (e = 0; u > e; e++)
                t(n[e], e, n);
        else {
            var i = h.keys(n);
            for (e = 0,
            u = i.length; u > e; e++)
                t(n[i[e]], i[e], n)
        }
        return n
    }
    ,
    h.map = h.collect = function(n, t, r) {
        if (null == n)
            return [];
        t = h.iteratee(t, r);
        for (var e, u = n.length !== +n.length && h.keys(n), i = (u || n).length, a = Array(i), o = 0; i > o; o++)
            e = u ? u[o] : o,
            a[o] = t(n[e], e, n);
        return a
    }
    ;
    var v = "Reduce of empty array with no initial value";
    h.reduce = h.foldl = h.inject = function(n, t, r, e) {
        null == n && (n = []),
        t = g(t, e, 4);
        var u, i = n.length !== +n.length && h.keys(n), a = (i || n).length, o = 0;
        if (arguments.length < 3) {
            if (!a)
                throw new TypeError(v);
            r = n[i ? i[o++] : o++]
        }
        for (; a > o; o++)
            u = i ? i[o] : o,
            r = t(r, n[u], u, n);
        return r
    }
    ,
    h.reduceRight = h.foldr = function(n, t, r, e) {
        null == n && (n = []),
        t = g(t, e, 4);
        var u, i = n.length !== +n.length && h.keys(n), a = (i || n).length;
        if (arguments.length < 3) {
            if (!a)
                throw new TypeError(v);
            r = n[i ? i[--a] : --a]
        }
        for (; a--; )
            u = i ? i[a] : a,
            r = t(r, n[u], u, n);
        return r
    }
    ,
    h.find = h.detect = function(n, t, r) {
        var e;
        return t = h.iteratee(t, r),
        h.some(n, function(n, r, u) {
            return t(n, r, u) ? (e = n,
            !0) : void 0
        }),
        e
    }
    ,
    h.filter = h.select = function(n, t, r) {
        var e = [];
        return null == n ? e : (t = h.iteratee(t, r),
        h.each(n, function(n, r, u) {
            t(n, r, u) && e.push(n)
        }),
        e)
    }
    ,
    h.reject = function(n, t, r) {
        return h.filter(n, h.negate(h.iteratee(t)), r)
    }
    ,
    h.every = h.all = function(n, t, r) {
        if (null == n)
            return !0;
        t = h.iteratee(t, r);
        var e, u, i = n.length !== +n.length && h.keys(n), a = (i || n).length;
        for (e = 0; a > e; e++)
            if (u = i ? i[e] : e,
            !t(n[u], u, n))
                return !1;
        return !0
    }
    ,
    h.some = h.any = function(n, t, r) {
        if (null == n)
            return !1;
        t = h.iteratee(t, r);
        var e, u, i = n.length !== +n.length && h.keys(n), a = (i || n).length;
        for (e = 0; a > e; e++)
            if (u = i ? i[e] : e,
            t(n[u], u, n))
                return !0;
        return !1
    }
    ,
    h.contains = h.include = function(n, t) {
        return null == n ? !1 : (n.length !== +n.length && (n = h.values(n)),
        h.indexOf(n, t) >= 0)
    }
    ,
    h.invoke = function(n, t) {
        var r = a.call(arguments, 2)
          , e = h.isFunction(t);
        return h.map(n, function(n) {
            return (e ? t : n[t]).apply(n, r)
        })
    }
    ,
    h.pluck = function(n, t) {
        return h.map(n, h.property(t))
    }
    ,
    h.where = function(n, t) {
        return h.filter(n, h.matches(t))
    }
    ,
    h.findWhere = function(n, t) {
        return h.find(n, h.matches(t))
    }
    ,
    h.max = function(n, t, r) {
        var e, u, i = -1 / 0, a = -1 / 0;
        if (null == t && null != n) {
            n = n.length === +n.length ? n : h.values(n);
            for (var o = 0, l = n.length; l > o; o++)
                e = n[o],
                e > i && (i = e)
        } else
            t = h.iteratee(t, r),
            h.each(n, function(n, r, e) {
                u = t(n, r, e),
                (u > a || u === -1 / 0 && i === -1 / 0) && (i = n,
                a = u)
            });
        return i
    }
    ,
    h.min = function(n, t, r) {
        var e, u, i = 1 / 0, a = 1 / 0;
        if (null == t && null != n) {
            n = n.length === +n.length ? n : h.values(n);
            for (var o = 0, l = n.length; l > o; o++)
                e = n[o],
                i > e && (i = e)
        } else
            t = h.iteratee(t, r),
            h.each(n, function(n, r, e) {
                u = t(n, r, e),
                (a > u || 1 / 0 === u && 1 / 0 === i) && (i = n,
                a = u)
            });
        return i
    }
    ,
    h.shuffle = function(n) {
        for (var t, r = n && n.length === +n.length ? n : h.values(n), e = r.length, u = Array(e), i = 0; e > i; i++)
            t = h.random(0, i),
            t !== i && (u[i] = u[t]),
            u[t] = r[i];
        return u
    }
    ,
    h.sample = function(n, t, r) {
        return null == t || r ? (n.length !== +n.length && (n = h.values(n)),
        n[h.random(n.length - 1)]) : h.shuffle(n).slice(0, Math.max(0, t))
    }
    ,
    h.sortBy = function(n, t, r) {
        return t = h.iteratee(t, r),
        h.pluck(h.map(n, function(n, r, e) {
            return {
                value: n,
                index: r,
                criteria: t(n, r, e)
            }
        }).sort(function(n, t) {
            var r = n.criteria
              , e = t.criteria;
            if (r !== e) {
                if (r > e || r === void 0)
                    return 1;
                if (e > r || e === void 0)
                    return -1
            }
            return n.index - t.index
        }), "value")
    }
    ;
    var m = function(n) {
        return function(t, r, e) {
            var u = {};
            return r = h.iteratee(r, e),
            h.each(t, function(e, i) {
                var a = r(e, i, t);
                n(u, e, a)
            }),
            u
        }
    };
    h.groupBy = m(function(n, t, r) {
        h.has(n, r) ? n[r].push(t) : n[r] = [t]
    }),
    h.indexBy = m(function(n, t, r) {
        n[r] = t
    }),
    h.countBy = m(function(n, t, r) {
        h.has(n, r) ? n[r]++ : n[r] = 1
    }),
    h.sortedIndex = function(n, t, r, e) {
        r = h.iteratee(r, e, 1);
        for (var u = r(t), i = 0, a = n.length; a > i; ) {
            var o = i + a >>> 1;
            r(n[o]) < u ? i = o + 1 : a = o
        }
        return i
    }
    ,
    h.toArray = function(n) {
        return n ? h.isArray(n) ? a.call(n) : n.length === +n.length ? h.map(n, h.identity) : h.values(n) : []
    }
    ,
    h.size = function(n) {
        return null == n ? 0 : n.length === +n.length ? n.length : h.keys(n).length
    }
    ,
    h.partition = function(n, t, r) {
        t = h.iteratee(t, r);
        var e = []
          , u = [];
        return h.each(n, function(n, r, i) {
            (t(n, r, i) ? e : u).push(n)
        }),
        [e, u]
    }
    ,
    h.first = h.head = h.take = function(n, t, r) {
        return null == n ? void 0 : null == t || r ? n[0] : 0 > t ? [] : a.call(n, 0, t)
    }
    ,
    h.initial = function(n, t, r) {
        return a.call(n, 0, Math.max(0, n.length - (null == t || r ? 1 : t)))
    }
    ,
    h.last = function(n, t, r) {
        return null == n ? void 0 : null == t || r ? n[n.length - 1] : a.call(n, Math.max(n.length - t, 0))
    }
    ,
    h.rest = h.tail = h.drop = function(n, t, r) {
        return a.call(n, null == t || r ? 1 : t)
    }
    ,
    h.compact = function(n) {
        return h.filter(n, h.identity)
    }
    ;
    var y = function(n, t, r, e) {
        if (t && h.every(n, h.isArray))
            return o.apply(e, n);
        for (var u = 0, a = n.length; a > u; u++) {
            var l = n[u];
            h.isArray(l) || h.isArguments(l) ? t ? i.apply(e, l) : y(l, t, r, e) : r || e.push(l)
        }
        return e
    };
    h.flatten = function(n, t) {
        return y(n, t, !1, [])
    }
    ,
    h.without = function(n) {
        return h.difference(n, a.call(arguments, 1))
    }
    ,
    h.uniq = h.unique = function(n, t, r, e) {
        if (null == n)
            return [];
        h.isBoolean(t) || (e = r,
        r = t,
        t = !1),
        null != r && (r = h.iteratee(r, e));
        for (var u = [], i = [], a = 0, o = n.length; o > a; a++) {
            var l = n[a];
            if (t)
                a && i === l || u.push(l),
                i = l;
            else if (r) {
                var c = r(l, a, n);
                h.indexOf(i, c) < 0 && (i.push(c),
                u.push(l))
            } else
                h.indexOf(u, l) < 0 && u.push(l)
        }
        return u
    }
    ,
    h.union = function() {
        return h.uniq(y(arguments, !0, !0, []))
    }
    ,
    h.intersection = function(n) {
        if (null == n)
            return [];
        for (var t = [], r = arguments.length, e = 0, u = n.length; u > e; e++) {
            var i = n[e];
            if (!h.contains(t, i)) {
                for (var a = 1; r > a && h.contains(arguments[a], i); a++)
                    ;
                a === r && t.push(i)
            }
        }
        return t
    }
    ,
    h.difference = function(n) {
        var t = y(a.call(arguments, 1), !0, !0, []);
        return h.filter(n, function(n) {
            return !h.contains(t, n)
        })
    }
    ,
    h.zip = function(n) {
        if (null == n)
            return [];
        for (var t = h.max(arguments, "length").length, r = Array(t), e = 0; t > e; e++)
            r[e] = h.pluck(arguments, e);
        return r
    }
    ,
    h.object = function(n, t) {
        if (null == n)
            return {};
        for (var r = {}, e = 0, u = n.length; u > e; e++)
            t ? r[n[e]] = t[e] : r[n[e][0]] = n[e][1];
        return r
    }
    ,
    h.indexOf = function(n, t, r) {
        if (null == n)
            return -1;
        var e = 0
          , u = n.length;
        if (r) {
            if ("number" != typeof r)
                return e = h.sortedIndex(n, t),
                n[e] === t ? e : -1;
            e = 0 > r ? Math.max(0, u + r) : r
        }
        for (; u > e; e++)
            if (n[e] === t)
                return e;
        return -1
    }
    ,
    h.lastIndexOf = function(n, t, r) {
        if (null == n)
            return -1;
        var e = n.length;
        for ("number" == typeof r && (e = 0 > r ? e + r + 1 : Math.min(e, r + 1)); --e >= 0; )
            if (n[e] === t)
                return e;
        return -1
    }
    ,
    h.range = function(n, t, r) {
        arguments.length <= 1 && (t = n || 0,
        n = 0),
        r = r || 1;
        for (var e = Math.max(Math.ceil((t - n) / r), 0), u = Array(e), i = 0; e > i; i++,
        n += r)
            u[i] = n;
        return u
    }
    ;
    var d = function() {};
    h.bind = function(n, t) {
        var r, e;
        if (p && n.bind === p)
            return p.apply(n, a.call(arguments, 1));
        if (!h.isFunction(n))
            throw new TypeError("Bind must be called on a function");
        return r = a.call(arguments, 2),
        e = function() {
            if (!(this instanceof e))
                return n.apply(t, r.concat(a.call(arguments)));
            d.prototype = n.prototype;
            var u = new d;
            d.prototype = null;
            var i = n.apply(u, r.concat(a.call(arguments)));
            return h.isObject(i) ? i : u
        }
    }
    ,
    h.partial = function(n) {
        var t = a.call(arguments, 1);
        return function() {
            for (var r = 0, e = t.slice(), u = 0, i = e.length; i > u; u++)
                e[u] === h && (e[u] = arguments[r++]);
            for (; r < arguments.length; )
                e.push(arguments[r++]);
            return n.apply(this, e)
        }
    }
    ,
    h.bindAll = function(n) {
        var t, r, e = arguments.length;
        if (1 >= e)
            throw new Error("bindAll must be passed function names");
        for (t = 1; e > t; t++)
            r = arguments[t],
            n[r] = h.bind(n[r], n);
        return n
    }
    ,
    h.memoize = function(n, t) {
        var r = function(e) {
            var u = r.cache
              , i = t ? t.apply(this, arguments) : e;
            return h.has(u, i) || (u[i] = n.apply(this, arguments)),
            u[i]
        };
        return r.cache = {},
        r
    }
    ,
    h.delay = function(n, t) {
        var r = a.call(arguments, 2);
        return setTimeout(function() {
            return n.apply(null, r)
        }, t)
    }
    ,
    h.defer = function(n) {
        return h.delay.apply(h, [n, 1].concat(a.call(arguments, 1)))
    }
    ,
    h.throttle = function(n, t, r) {
        var e, u, i, a = null, o = 0;
        r || (r = {});
        var l = function() {
            o = r.leading === !1 ? 0 : h.now(),
            a = null,
            i = n.apply(e, u),
            a || (e = u = null)
        };
        return function() {
            var c = h.now();
            o || r.leading !== !1 || (o = c);
            var f = t - (c - o);
            return e = this,
            u = arguments,
            0 >= f || f > t ? (clearTimeout(a),
            a = null,
            o = c,
            i = n.apply(e, u),
            a || (e = u = null)) : a || r.trailing === !1 || (a = setTimeout(l, f)),
            i
        }
    }
    ,
    h.debounce = function(n, t, r) {
        var e, u, i, a, o, l = function() {
            var c = h.now() - a;
            t > c && c > 0 ? e = setTimeout(l, t - c) : (e = null,
            r || (o = n.apply(i, u),
            e || (i = u = null)))
        };
        return function() {
            i = this,
            u = arguments,
            a = h.now();
            var c = r && !e;
            return e || (e = setTimeout(l, t)),
            c && (o = n.apply(i, u),
            i = u = null),
            o
        }
    }
    ,
    h.wrap = function(n, t) {
        return h.partial(t, n)
    }
    ,
    h.negate = function(n) {
        return function() {
            return !n.apply(this, arguments)
        }
    }
    ,
    h.compose = function() {
        var n = arguments
          , t = n.length - 1;
        return function() {
            for (var r = t, e = n[t].apply(this, arguments); r--; )
                e = n[r].call(this, e);
            return e
        }
    }
    ,
    h.after = function(n, t) {
        return function() {
            return --n < 1 ? t.apply(this, arguments) : void 0
        }
    }
    ,
    h.before = function(n, t) {
        var r;
        return function() {
            return --n > 0 ? r = t.apply(this, arguments) : t = null,
            r
        }
    }
    ,
    h.once = h.partial(h.before, 2),
    h.keys = function(n) {
        if (!h.isObject(n))
            return [];
        if (s)
            return s(n);
        var t = [];
        for (var r in n)
            h.has(n, r) && t.push(r);
        return t
    }
    ,
    h.values = function(n) {
        for (var t = h.keys(n), r = t.length, e = Array(r), u = 0; r > u; u++)
            e[u] = n[t[u]];
        return e
    }
    ,
    h.pairs = function(n) {
        for (var t = h.keys(n), r = t.length, e = Array(r), u = 0; r > u; u++)
            e[u] = [t[u], n[t[u]]];
        return e
    }
    ,
    h.invert = function(n) {
        for (var t = {}, r = h.keys(n), e = 0, u = r.length; u > e; e++)
            t[n[r[e]]] = r[e];
        return t
    }
    ,
    h.functions = h.methods = function(n) {
        var t = [];
        for (var r in n)
            h.isFunction(n[r]) && t.push(r);
        return t.sort()
    }
    ,
    h.extend = function(n) {
        if (!h.isObject(n))
            return n;
        for (var t, r, e = 1, u = arguments.length; u > e; e++) {
            t = arguments[e];
            for (r in t)
                c.call(t, r) && (n[r] = t[r])
        }
        return n
    }
    ,
    h.pick = function(n, t, r) {
        var e, u = {};
        if (null == n)
            return u;
        if (h.isFunction(t)) {
            t = g(t, r);
            for (e in n) {
                var i = n[e];
                t(i, e, n) && (u[e] = i)
            }
        } else {
            var l = o.apply([], a.call(arguments, 1));
            n = new Object(n);
            for (var c = 0, f = l.length; f > c; c++)
                e = l[c],
                e in n && (u[e] = n[e])
        }
        return u
    }
    ,
    h.omit = function(n, t, r) {
        if (h.isFunction(t))
            t = h.negate(t);
        else {
            var e = h.map(o.apply([], a.call(arguments, 1)), String);
            t = function(n, t) {
                return !h.contains(e, t)
            }
        }
        return h.pick(n, t, r)
    }
    ,
    h.defaults = function(n) {
        if (!h.isObject(n))
            return n;
        for (var t = 1, r = arguments.length; r > t; t++) {
            var e = arguments[t];
            for (var u in e)
                n[u] === void 0 && (n[u] = e[u])
        }
        return n
    }
    ,
    h.clone = function(n) {
        return h.isObject(n) ? h.isArray(n) ? n.slice() : h.extend({}, n) : n
    }
    ,
    h.tap = function(n, t) {
        return t(n),
        n
    }
    ;
    var b = function(n, t, r, e) {
        if (n === t)
            return 0 !== n || 1 / n === 1 / t;
        if (null == n || null == t)
            return n === t;
        n instanceof h && (n = n._wrapped),
        t instanceof h && (t = t._wrapped);
        var u = l.call(n);
        if (u !== l.call(t))
            return !1;
        switch (u) {
        case "[object RegExp]":
        case "[object String]":
            return "" + n == "" + t;
        case "[object Number]":
            return +n !== +n ? +t !== +t : 0 === +n ? 1 / +n === 1 / t : +n === +t;
        case "[object Date]":
        case "[object Boolean]":
            return +n === +t
        }
        if ("object" != typeof n || "object" != typeof t)
            return !1;
        for (var i = r.length; i--; )
            if (r[i] === n)
                return e[i] === t;
        var a = n.constructor
          , o = t.constructor;
        if (a !== o && "constructor"in n && "constructor"in t && !(h.isFunction(a) && a instanceof a && h.isFunction(o) && o instanceof o))
            return !1;
        r.push(n),
        e.push(t);
        var c, f;
        if ("[object Array]" === u) {
            if (c = n.length,
            f = c === t.length)
                for (; c-- && (f = b(n[c], t[c], r, e)); )
                    ;
        } else {
            var s, p = h.keys(n);
            if (c = p.length,
            f = h.keys(t).length === c)
                for (; c-- && (s = p[c],
                f = h.has(t, s) && b(n[s], t[s], r, e)); )
                    ;
        }
        return r.pop(),
        e.pop(),
        f
    };
    h.isEqual = function(n, t) {
        return b(n, t, [], [])
    }
    ,
    h.isEmpty = function(n) {
        if (null == n)
            return !0;
        if (h.isArray(n) || h.isString(n) || h.isArguments(n))
            return 0 === n.length;
        for (var t in n)
            if (h.has(n, t))
                return !1;
        return !0
    }
    ,
    h.isElement = function(n) {
        return !(!n || 1 !== n.nodeType)
    }
    ,
    h.isArray = f || function(n) {
        return "[object Array]" === l.call(n)
    }
    ,
    h.isObject = function(n) {
        var t = typeof n;
        return "function" === t || "object" === t && !!n
    }
    ,
    h.each(["Arguments", "Function", "String", "Number", "Date", "RegExp"], function(n) {
        h["is" + n] = function(t) {
            return l.call(t) === "[object " + n + "]"
        }
    }),
    h.isArguments(arguments) || (h.isArguments = function(n) {
        return h.has(n, "callee")
    }
    ),
    "function" != typeof /./ && (h.isFunction = function(n) {
        return "function" == typeof n || !1
    }
    ),
    h.isFinite = function(n) {
        return isFinite(n) && !isNaN(parseFloat(n))
    }
    ,
    h.isNaN = function(n) {
        return h.isNumber(n) && n !== +n
    }
    ,
    h.isBoolean = function(n) {
        return n === !0 || n === !1 || "[object Boolean]" === l.call(n)
    }
    ,
    h.isNull = function(n) {
        return null === n
    }
    ,
    h.isUndefined = function(n) {
        return n === void 0
    }
    ,
    h.has = function(n, t) {
        return null != n && c.call(n, t)
    }
    ,
    h.noConflict = function() {
        return n._ = t,
        this
    }
    ,
    h.identity = function(n) {
        return n
    }
    ,
    h.constant = function(n) {
        return function() {
            return n
        }
    }
    ,
    h.noop = function() {}
    ,
    h.property = function(n) {
        return function(t) {
            return t[n]
        }
    }
    ,
    h.matches = function(n) {
        var t = h.pairs(n)
          , r = t.length;
        return function(n) {
            if (null == n)
                return !r;
            n = new Object(n);
            for (var e = 0; r > e; e++) {
                var u = t[e]
                  , i = u[0];
                if (u[1] !== n[i] || !(i in n))
                    return !1
            }
            return !0
        }
    }
    ,
    h.times = function(n, t, r) {
        var e = Array(Math.max(0, n));
        t = g(t, r, 1);
        for (var u = 0; n > u; u++)
            e[u] = t(u);
        return e
    }
    ,
    h.random = function(n, t) {
        return null == t && (t = n,
        n = 0),
        n + Math.floor(Math.random() * (t - n + 1))
    }
    ,
    h.now = Date.now || function() {
        return (new Date).getTime()
    }
    ;
    var _ = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#x27;",
        "`": "&#x60;"
    }
      , w = h.invert(_)
      , j = function(n) {
        var t = function(t) {
            return n[t]
        }
          , r = "(?:" + h.keys(n).join("|") + ")"
          , e = RegExp(r)
          , u = RegExp(r, "g");
        return function(n) {
            return n = null == n ? "" : "" + n,
            e.test(n) ? n.replace(u, t) : n
        }
    };
    h.escape = j(_),
    h.unescape = j(w),
    h.result = function(n, t) {
        if (null == n)
            return void 0;
        var r = n[t];
        return h.isFunction(r) ? n[t]() : r
    }
    ;
    var x = 0;
    h.uniqueId = function(n) {
        var t = ++x + "";
        return n ? n + t : t
    }
    ,
    h.templateSettings = {
        evaluate: /<%([\s\S]+?)%>/g,
        interpolate: /<%=([\s\S]+?)%>/g,
        escape: /<%-([\s\S]+?)%>/g
    };
    var A = /(.)^/
      , k = {
        "'": "'",
        "\\": "\\",
        "\r": "r",
        "\n": "n",
        "\u2028": "u2028",
        "\u2029": "u2029"
    }
      , O = /\\|'|\r|\n|\u2028|\u2029/g
      , F = function(n) {
        return "\\" + k[n]
    };
    h.template = function(n, t, r) {
        !t && r && (t = r),
        t = h.defaults({}, t, h.templateSettings);
        var e = RegExp([(t.escape || A).source, (t.interpolate || A).source, (t.evaluate || A).source].join("|") + "|$", "g")
          , u = 0
          , i = "__p+='";
        n.replace(e, function(t, r, e, a, o) {
            return i += n.slice(u, o).replace(O, F),
            u = o + t.length,
            r ? i += "'+\n((__t=(" + r + "))==null?'':_.escape(__t))+\n'" : e ? i += "'+\n((__t=(" + e + "))==null?'':__t)+\n'" : a && (i += "';\n" + a + "\n__p+='"),
            t
        }),
        i += "';\n",
        t.variable || (i = "with(obj||{}){\n" + i + "}\n"),
        i = "var __t,__p='',__j=Array.prototype.join," + "print=function(){__p+=__j.call(arguments,'');};\n" + i + "return __p;\n";
        try {
            var a = new Function(t.variable || "obj","_",i)
        } catch (o) {
            throw o.source = i,
            o
        }
        var l = function(n) {
            return a.call(this, n, h)
        }
          , c = t.variable || "obj";
        return l.source = "function(" + c + "){\n" + i + "}",
        l
    }
    ,
    h.chain = function(n) {
        var t = h(n);
        return t._chain = !0,
        t
    }
    ;
    var E = function(n) {
        return this._chain ? h(n).chain() : n
    };
    h.mixin = function(n) {
        h.each(h.functions(n), function(t) {
            var r = h[t] = n[t];
            h.prototype[t] = function() {
                var n = [this._wrapped];
                return i.apply(n, arguments),
                E.call(this, r.apply(h, n))
            }
        })
    }
    ,
    h.mixin(h),
    h.each(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function(n) {
        var t = r[n];
        h.prototype[n] = function() {
            var r = this._wrapped;
            return t.apply(r, arguments),
            "shift" !== n && "splice" !== n || 0 !== r.length || delete r[0],
            E.call(this, r)
        }
    }),
    h.each(["concat", "join", "slice"], function(n) {
        var t = r[n];
        h.prototype[n] = function() {
            return E.call(this, t.apply(this._wrapped, arguments))
        }
    }),
    h.prototype.value = function() {
        return this._wrapped
    }
    ,
    "function" == typeof define && false && define("underscore", [], function() {
        return h
    })
}
).call(this);
//# sourceMappingURL=underscore-min.map;
!function(r) {
    var n = {};
    function o(t) {
        if (n[t])
            return n[t].exports;
        var e = n[t] = {
            i: t,
            l: !1,
            exports: {}
        };
        return r[t].call(e.exports, e, e.exports, o),
        e.l = !0,
        e.exports
    }
    o.m = r,
    o.c = n,
    o.d = function(t, e, r) {
        o.o(t, e) || Object.defineProperty(t, e, {
            enumerable: !0,
            get: r
        })
    }
    ,
    o.r = function(t) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
            value: "Module"
        }),
        Object.defineProperty(t, "__esModule", {
            value: !0
        })
    }
    ,
    o.t = function(e, t) {
        if (1 & t && (e = o(e)),
        8 & t)
            return e;
        if (4 & t && "object" == typeof e && e && e.__esModule)
            return e;
        var r = Object.create(null);
        if (o.r(r),
        Object.defineProperty(r, "default", {
            enumerable: !0,
            value: e
        }),
        2 & t && "string" != typeof e)
            for (var n in e)
                o.d(r, n, function(t) {
                    return e[t]
                }
                .bind(null, n));
        return r
    }
    ,
    o.n = function(t) {
        var e = t && t.__esModule ? function() {
            return t.default
        }
        : function() {
            return t
        }
        ;
        return o.d(e, "a", e),
        e
    }
    ,
    o.o = function(t, e) {
        return Object.prototype.hasOwnProperty.call(t, e)
    }
    ,
    o.p = "",
    o(o.s = 799)
}({
    1: function(t, e) {
        var r = function() {
            return this
        }();
        try {
            r = r || Function("return this")() || (0,
            eval)("this")
        } catch (t) {
            "object" == typeof window && (r = window)
        }
        t.exports = r
    },
    12: function(t, f, e) {
        var o, r = e(789), i = e(164), l = e(788), s = e(787), u = e(786);
        "undefined" != typeof ArrayBuffer && (o = e(785));
        var n = "undefined" != typeof navigator && /Android/i.test(navigator.userAgent)
          , a = "undefined" != typeof navigator && /PhantomJS/i.test(navigator.userAgent)
          , p = n || a;
        f.protocol = 3;
        var h = f.packets = {
            open: 0,
            close: 1,
            ping: 2,
            pong: 3,
            message: 4,
            upgrade: 5,
            noop: 6
        }
          , c = r(h)
          , d = {
            type: "error",
            data: "parser error"
        }
          , y = e(784);
        function g(t, e, r) {
            for (var o = new Array(t.length), n = s(t.length, r), i = 0; i < t.length; i++)
                !function(r, t, n) {
                    e(t, function(t, e) {
                        o[r] = e,
                        n(t, o)
                    })
                }(i, t[i], n)
        }
        f.encodePacket = function(t, e, r, n) {
            "function" == typeof e && (n = e,
            e = !1),
            "function" == typeof r && (n = r,
            r = null);
            var o, i, s, a = void 0 === t.data ? void 0 : t.data.buffer || t.data;
            if ("undefined" != typeof ArrayBuffer && a instanceof ArrayBuffer)
                return function(t, e, r) {
                    if (!e)
                        return f.encodeBase64Packet(t, r);
                    var n = t.data
                      , o = new Uint8Array(n)
                      , i = new Uint8Array(1 + n.byteLength);
                    i[0] = h[t.type];
                    for (var s = 0; s < o.length; s++)
                        i[s + 1] = o[s];
                    return r(i.buffer)
                }(t, e, n);
            if (void 0 !== y && a instanceof y)
                return function(t, e, r) {
                    if (!e)
                        return f.encodeBase64Packet(t, r);
                    if (p)
                        return function(t, e, r) {
                            if (!e)
                                return f.encodeBase64Packet(t, r);
                            var n = new FileReader;
                            return n.onload = function() {
                                f.encodePacket({
                                    type: t.type,
                                    data: n.result
                                }, e, !0, r)
                            }
                            ,
                            n.readAsArrayBuffer(t.data)
                        }(t, e, r);
                    var n = new Uint8Array(1);
                    n[0] = h[t.type];
                    var o = new y([n.buffer, t.data]);
                    return r(o)
                }(t, e, n);
            if (a && a.base64)
                return o = t,
                i = n,
                s = "b" + f.packets[o.type] + o.data.data,
                i(s);
            var c = h[t.type];
            return void 0 !== t.data && (c += r ? u.encode(String(t.data), {
                strict: !1
            }) : String(t.data)),
            n("" + c)
        }
        ,
        f.encodeBase64Packet = function(e, r) {
            var n, o = "b" + f.packets[e.type];
            if (void 0 !== y && e.data instanceof y) {
                var i = new FileReader;
                return i.onload = function() {
                    var t = i.result.split(",")[1];
                    r(o + t)
                }
                ,
                i.readAsDataURL(e.data)
            }
            try {
                n = String.fromCharCode.apply(null, new Uint8Array(e.data))
            } catch (t) {
                for (var s = new Uint8Array(e.data), a = new Array(s.length), c = 0; c < s.length; c++)
                    a[c] = s[c];
                n = String.fromCharCode.apply(null, a)
            }
            return o += btoa(n),
            r(o)
        }
        ,
        f.decodePacket = function(t, e, r) {
            if (void 0 === t)
                return d;
            if ("string" == typeof t) {
                if ("b" === t.charAt(0))
                    return f.decodeBase64Packet(t.substr(1), e);
                if (r && !1 === (t = function(t) {
                    try {
                        t = u.decode(t, {
                            strict: !1
                        })
                    } catch (t) {
                        return !1
                    }
                    return t
                }(t)))
                    return d;
                var n = t.charAt(0);
                return Number(n) == n && c[n] ? 1 < t.length ? {
                    type: c[n],
                    data: t.substring(1)
                } : {
                    type: c[n]
                } : d
            }
            var n = new Uint8Array(t)[0]
              , o = l(t, 1);
            return y && "blob" === e && (o = new y([o])),
            {
                type: c[n],
                data: o
            }
        }
        ,
        f.decodeBase64Packet = function(t, e) {
            var r = c[t.charAt(0)];
            if (!o)
                return {
                    type: r,
                    data: {
                        base64: !0,
                        data: t.substr(1)
                    }
                };
            var n = o.decode(t.substr(1));
            return "blob" === e && y && (n = new y([n])),
            {
                type: r,
                data: n
            }
        }
        ,
        f.encodePayload = function(t, e, r) {
            "function" == typeof e && (r = e,
            e = null);
            var n = i(t);
            if (e && n)
                return y && !p ? f.encodePayloadAsBlob(t, r) : f.encodePayloadAsArrayBuffer(t, r);
            if (!t.length)
                return r("0:");
            g(t, function(t, r) {
                f.encodePacket(t, !!n && e, !1, function(t) {
                    var e;
                    r(null, (e = t).length + ":" + e)
                })
            }, function(t, e) {
                return r(e.join(""))
            })
        }
        ,
        f.decodePayload = function(t, e, r) {
            if ("string" != typeof t)
                return f.decodePayloadAsBinary(t, e, r);
            var n;
            if ("function" == typeof e && (r = e,
            e = null),
            "" === t)
                return r(d, 0, 1);
            for (var o, i, s = "", a = 0, c = t.length; a < c; a++) {
                var u = t.charAt(a);
                if (":" === u) {
                    if ("" === s || s != (o = Number(s)))
                        return r(d, 0, 1);
                    if (s != (i = t.substr(a + 1, o)).length)
                        return r(d, 0, 1);
                    if (i.length) {
                        if (n = f.decodePacket(i, e, !1),
                        d.type === n.type && d.data === n.data)
                            return r(d, 0, 1);
                        if (!1 === r(n, a + o, c))
                            return
                    }
                    a += o,
                    s = ""
                } else
                    s += u
            }
            return "" !== s ? r(d, 0, 1) : void 0
        }
        ,
        f.encodePayloadAsArrayBuffer = function(t, n) {
            if (!t.length)
                return n(new ArrayBuffer(0));
            g(t, function(t, e) {
                f.encodePacket(t, !0, !0, function(t) {
                    return e(null, t)
                })
            }, function(t, e) {
                var r = e.reduce(function(t, e) {
                    var r = "string" == typeof e ? e.length : e.byteLength;
                    return t + r.toString().length + r + 2
                }, 0)
                  , s = new Uint8Array(r)
                  , a = 0;
                return e.forEach(function(t) {
                    var e = "string" == typeof t
                      , r = t;
                    if (e) {
                        for (var n = new Uint8Array(t.length), o = 0; o < t.length; o++)
                            n[o] = t.charCodeAt(o);
                        r = n.buffer
                    }
                    s[a++] = e ? 0 : 1;
                    for (var i = r.byteLength.toString(), o = 0; o < i.length; o++)
                        s[a++] = parseInt(i[o]);
                    s[a++] = 255;
                    for (n = new Uint8Array(r),
                    o = 0; o < n.length; o++)
                        s[a++] = n[o]
                }),
                n(s.buffer)
            })
        }
        ,
        f.encodePayloadAsBlob = function(t, r) {
            g(t, function(t, a) {
                f.encodePacket(t, !0, !0, function(t) {
                    var e = new Uint8Array(1);
                    if (e[0] = 1,
                    "string" == typeof t) {
                        for (var r = new Uint8Array(t.length), n = 0; n < t.length; n++)
                            r[n] = t.charCodeAt(n);
                        t = r.buffer,
                        e[0] = 0
                    }
                    for (var o, i = (t instanceof ArrayBuffer ? t.byteLength : t.size).toString(), s = new Uint8Array(i.length + 1), n = 0; n < i.length; n++)
                        s[n] = parseInt(i[n]);
                    s[i.length] = 255,
                    y && (o = new y([e.buffer, s.buffer, t]),
                    a(null, o))
                })
            }, function(t, e) {
                return r(new y(e))
            })
        }
        ,
        f.decodePayloadAsBinary = function(t, r, n) {
            "function" == typeof r && (n = r,
            r = null);
            for (var e = t, o = []; 0 < e.byteLength; ) {
                for (var i = new Uint8Array(e), s = 0 === i[0], a = "", c = 1; 255 !== i[c]; c++) {
                    if (310 < a.length)
                        return n(d, 0, 1);
                    a += i[c]
                }
                e = l(e, 2 + a.length),
                a = parseInt(a);
                var u = l(e, 0, a);
                if (s)
                    try {
                        u = String.fromCharCode.apply(null, new Uint8Array(u))
                    } catch (t) {
                        var p = new Uint8Array(u);
                        u = "";
                        for (c = 0; c < p.length; c++)
                            u += String.fromCharCode(p[c])
                    }
                o.push(u),
                e = l(e, a)
            }
            var h = o.length;
            o.forEach(function(t, e) {
                n(f.decodePacket(t, r, !0), e, h)
            })
        }
    },
    13: function(t, e, r) {
        function n(t) {
            if (t)
                return function(t) {
                    for (var e in n.prototype)
                        t[e] = n.prototype[e];
                    return t
                }(t)
        }
        (t.exports = n).prototype.on = n.prototype.addEventListener = function(t, e) {
            return this._callbacks = this._callbacks || {},
            (this._callbacks["$" + t] = this._callbacks["$" + t] || []).push(e),
            this
        }
        ,
        n.prototype.once = function(t, e) {
            function r() {
                this.off(t, r),
                e.apply(this, arguments)
            }
            return r.fn = e,
            this.on(t, r),
            this
        }
        ,
        n.prototype.off = n.prototype.removeListener = n.prototype.removeAllListeners = n.prototype.removeEventListener = function(t, e) {
            if (this._callbacks = this._callbacks || {},
            0 == arguments.length)
                return this._callbacks = {},
                this;
            var r, n = this._callbacks["$" + t];
            if (!n)
                return this;
            if (1 == arguments.length)
                return delete this._callbacks["$" + t],
                this;
            for (var o = 0; o < n.length; o++)
                if ((r = n[o]) === e || r.fn === e) {
                    n.splice(o, 1);
                    break
                }
            return 0 === n.length && delete this._callbacks["$" + t],
            this
        }
        ,
        n.prototype.emit = function(t) {
            this._callbacks = this._callbacks || {};
            for (var e = new Array(arguments.length - 1), r = this._callbacks["$" + t], n = 1; n < arguments.length; n++)
                e[n - 1] = arguments[n];
            if (r)
                for (var n = 0, o = (r = r.slice(0)).length; n < o; ++n)
                    r[n].apply(this, e);
            return this
        }
        ,
        n.prototype.listeners = function(t) {
            return this._callbacks = this._callbacks || {},
            this._callbacks["$" + t] || []
        }
        ,
        n.prototype.hasListeners = function(t) {
            return !!this.listeners(t).length
        }
    },
    143: function(t, e) {
        t.exports = function(t, e) {
            function r() {}
            r.prototype = e.prototype,
            t.prototype = new r,
            t.prototype.constructor = t
        }
    },
    144: function(t, e) {
        e.encode = function(t) {
            var e = "";
            for (var r in t)
                t.hasOwnProperty(r) && (e.length && (e += "&"),
                e += encodeURIComponent(r) + "=" + encodeURIComponent(t[r]));
            return e
        }
        ,
        e.decode = function(t) {
            for (var e = {}, r = t.split("&"), n = 0, o = r.length; n < o; n++) {
                var i = r[n].split("=");
                e[decodeURIComponent(i[0])] = decodeURIComponent(i[1])
            }
            return e
        }
    },
    15: function(t, e) {
        var r, n, o = t.exports = {};
        function i() {
            throw new Error("setTimeout has not been defined")
        }
        function s() {
            throw new Error("clearTimeout has not been defined")
        }
        function a(e) {
            if (r === setTimeout)
                return setTimeout(e, 0);
            if ((r === i || !r) && setTimeout)
                return r = setTimeout,
                setTimeout(e, 0);
            try {
                return r(e, 0)
            } catch (t) {
                try {
                    return r.call(null, e, 0)
                } catch (t) {
                    return r.call(this, e, 0)
                }
            }
        }
        !function() {
            try {
                r = "function" == typeof setTimeout ? setTimeout : i
            } catch (t) {
                r = i
            }
            try {
                n = "function" == typeof clearTimeout ? clearTimeout : s
            } catch (t) {
                n = s
            }
        }();
        var c, u = [], p = !1, h = -1;
        function f() {
            p && c && (p = !1,
            c.length ? u = c.concat(u) : h = -1,
            u.length && l())
        }
        function l() {
            if (!p) {
                var t = a(f);
                p = !0;
                for (var e = u.length; e; ) {
                    for (c = u,
                    u = []; ++h < e; )
                        c && c[h].run();
                    h = -1,
                    e = u.length
                }
                c = null,
                p = !1,
                function(e) {
                    if (n === clearTimeout)
                        return clearTimeout(e);
                    if ((n === s || !n) && clearTimeout)
                        return n = clearTimeout,
                        clearTimeout(e);
                    try {
                        n(e)
                    } catch (t) {
                        try {
                            return n.call(null, e)
                        } catch (t) {
                            return n.call(this, e)
                        }
                    }
                }(t)
            }
        }
        function d(t, e) {
            this.fun = t,
            this.array = e
        }
        function y() {}
        o.nextTick = function(t) {
            var e = new Array(arguments.length - 1);
            if (1 < arguments.length)
                for (var r = 1; r < arguments.length; r++)
                    e[r - 1] = arguments[r];
            u.push(new d(t,e)),
            1 !== u.length || p || a(l)
        }
        ,
        d.prototype.run = function() {
            this.fun.apply(null, this.array)
        }
        ,
        o.title = "browser",
        o.browser = !0,
        o.env = {},
        o.argv = [],
        o.version = "",
        o.versions = {},
        o.on = y,
        o.addListener = y,
        o.once = y,
        o.off = y,
        o.removeListener = y,
        o.removeAllListeners = y,
        o.emit = y,
        o.prependListener = y,
        o.prependOnceListener = y,
        o.listeners = function(t) {
            return []
        }
        ,
        o.binding = function(t) {
            throw new Error("process.binding is not supported")
        }
        ,
        o.cwd = function() {
            return "/"
        }
        ,
        o.chdir = function(t) {
            throw new Error("process.chdir is not supported")
        }
        ,
        o.umask = function() {
            return 0
        }
    },
    152: function(t, e, r) {
        var n = r(12);
        function o(t) {
            this.path = t.path,
            this.hostname = t.hostname,
            this.port = t.port,
            this.secure = t.secure,
            this.query = t.query,
            this.timestampParam = t.timestampParam,
            this.timestampRequests = t.timestampRequests,
            this.readyState = "",
            this.agent = t.agent || !1,
            this.socket = t.socket,
            this.enablesXDR = t.enablesXDR,
            this.pfx = t.pfx,
            this.key = t.key,
            this.passphrase = t.passphrase,
            this.cert = t.cert,
            this.ca = t.ca,
            this.ciphers = t.ciphers,
            this.rejectUnauthorized = t.rejectUnauthorized,
            this.forceNode = t.forceNode,
            this.extraHeaders = t.extraHeaders,
            this.localAddress = t.localAddress
        }
        r(13)((t.exports = o).prototype),
        o.prototype.onError = function(t, e) {
            var r = new Error(t);
            return r.type = "TransportError",
            r.description = e,
            this.emit("error", r),
            this
        }
        ,
        o.prototype.open = function() {
            return "closed" !== this.readyState && "" !== this.readyState || (this.readyState = "opening",
            this.doOpen()),
            this
        }
        ,
        o.prototype.close = function() {
            return "opening" !== this.readyState && "open" !== this.readyState || (this.doClose(),
            this.onClose()),
            this
        }
        ,
        o.prototype.send = function(t) {
            if ("open" !== this.readyState)
                throw new Error("Transport not open");
            this.write(t)
        }
        ,
        o.prototype.onOpen = function() {
            this.readyState = "open",
            this.writable = !0,
            this.emit("open")
        }
        ,
        o.prototype.onData = function(t) {
            var e = n.decodePacket(t, this.socket.binaryType);
            this.onPacket(e)
        }
        ,
        o.prototype.onPacket = function(t) {
            this.emit("packet", t)
        }
        ,
        o.prototype.onClose = function() {
            this.readyState = "closed",
            this.emit("close")
        }
    },
    153: function(t, e, r) {
        (function(o) {
            var i = r(791);
            t.exports = function(t) {
                var e = t.xdomain
                  , r = t.xscheme
                  , n = t.enablesXDR;
                try {
                    if ("undefined" != typeof XMLHttpRequest && (!e || i))
                        return new XMLHttpRequest
                } catch (t) {}
                try {
                    if ("undefined" != typeof XDomainRequest && !r && n)
                        return new XDomainRequest
                } catch (t) {}
                if (!e)
                    try {
                        return new (o[["Active"].concat("Object").join("X")])("Microsoft.XMLHTTP")
                    } catch (t) {}
            }
        }
        ).call(this, r(1))
    },
    154: function(t, a, e) {
        var c = e(5)("socket.io-parser")
          , r = e(13)
          , i = e(794)
          , u = e(3)
          , n = e(168);
        function o() {}
        a.protocol = 4,
        a.types = ["CONNECT", "DISCONNECT", "EVENT", "ACK", "ERROR", "BINARY_EVENT", "BINARY_ACK"],
        a.CONNECT = 0,
        a.DISCONNECT = 1,
        a.EVENT = 2,
        a.ACK = 3,
        a.ERROR = 4,
        a.BINARY_EVENT = 5,
        a.BINARY_ACK = 6,
        a.Encoder = o,
        a.Decoder = h;
        var s = a.ERROR + '"encode error"';
        function p(t) {
            var e = "" + t.type;
            if (a.BINARY_EVENT !== t.type && a.BINARY_ACK !== t.type || (e += t.attachments + "-"),
            t.nsp && "/" !== t.nsp && (e += t.nsp + ","),
            null != t.id && (e += t.id),
            null != t.data) {
                var r = function(t) {
                    try {
                        return JSON.stringify(t)
                    } catch (t) {
                        return !1
                    }
                }(t.data);
                if (!1 === r)
                    return s;
                e += r
            }
            return c("encoded %j as %s", t, e),
            e
        }
        function h() {
            this.reconstructor = null
        }
        function f(t) {
            this.reconPack = t,
            this.buffers = []
        }
        function l(t) {
            return {
                type: a.ERROR,
                data: "parser error: " + t
            }
        }
        o.prototype.encode = function(t, e) {
            var r, o;
            c("encoding packet %j", t),
            a.BINARY_EVENT === t.type || a.BINARY_ACK === t.type ? (r = t,
            o = e,
            i.removeBlobs(r, function(t) {
                var e = i.deconstructPacket(t)
                  , r = p(e.packet)
                  , n = e.buffers;
                n.unshift(r),
                o(n)
            })) : e([p(t)])
        }
        ,
        r(h.prototype),
        h.prototype.add = function(t) {
            var e;
            if ("string" == typeof t)
                e = function(t) {
                    var e = 0
                      , r = {
                        type: Number(t.charAt(0))
                    };
                    if (null == a.types[r.type])
                        return l("unknown packet type " + r.type);
                    if (a.BINARY_EVENT === r.type || a.BINARY_ACK === r.type) {
                        for (var n = ""; "-" !== t.charAt(++e) && (n += t.charAt(e),
                        e != t.length); )
                            ;
                        if (n != Number(n) || "-" !== t.charAt(e))
                            throw new Error("Illegal attachments");
                        r.attachments = Number(n)
                    }
                    if ("/" === t.charAt(e + 1))
                        for (r.nsp = ""; ++e; ) {
                            if ("," === (i = t.charAt(e)))
                                break;
                            if (r.nsp += i,
                            e === t.length)
                                break
                        }
                    else
                        r.nsp = "/";
                    var o = t.charAt(e + 1);
                    if ("" !== o && Number(o) == o) {
                        for (r.id = ""; ++e; ) {
                            var i;
                            if (null == (i = t.charAt(e)) || Number(i) != i) {
                                --e;
                                break
                            }
                            if (r.id += t.charAt(e),
                            e === t.length)
                                break
                        }
                        r.id = Number(r.id)
                    }
                    if (t.charAt(++e)) {
                        var s = function(t) {
                            try {
                                return JSON.parse(t)
                            } catch (t) {
                                return !1
                            }
                        }(t.substr(e));
                        if (!(!1 !== s && (r.type === a.ERROR || u(s))))
                            return l("invalid payload");
                        r.data = s
                    }
                    return c("decoded %s as %j", t, r),
                    r
                }(t),
                a.BINARY_EVENT === e.type || a.BINARY_ACK === e.type ? (this.reconstructor = new f(e),
                0 === this.reconstructor.reconPack.attachments && this.emit("decoded", e)) : this.emit("decoded", e);
            else {
                if (!n(t) && !t.base64)
                    throw new Error("Unknown type: " + t);
                if (!this.reconstructor)
                    throw new Error("got binary data when not reconstructing a packet");
                (e = this.reconstructor.takeBinaryData(t)) && (this.reconstructor = null,
                this.emit("decoded", e))
            }
        }
        ,
        h.prototype.destroy = function() {
            this.reconstructor && this.reconstructor.finishedReconstruction()
        }
        ,
        f.prototype.takeBinaryData = function(t) {
            if (this.buffers.push(t),
            this.buffers.length !== this.reconPack.attachments)
                return null;
            var e = i.reconstructPacket(this.reconPack, this.buffers);
            return this.finishedReconstruction(),
            e
        }
        ,
        f.prototype.finishedReconstruction = function() {
            this.reconPack = null,
            this.buffers = []
        }
    },
    159: function(t, e) {
        var n = [].slice;
        t.exports = function(t, e) {
            if ("string" == typeof e && (e = t[e]),
            "function" != typeof e)
                throw new Error("bind() requires a function");
            var r = n.call(arguments, 2);
            return function() {
                return e.apply(t, r.concat(n.call(arguments)))
            }
        }
    },
    160: function(t, e) {
        t.exports = function(t, e, r) {
            return t.on(e, r),
            {
                destroy: function() {
                    t.removeListener(e, r)
                }
            }
        }
    },
    161: function(t, e, r) {
        var o = r(154)
          , n = r(13)
          , i = r(780)
          , s = r(160)
          , a = r(159)
          , c = r(5)("socket.io-client:socket")
          , u = r(144)
          , p = r(164);
        t.exports = l;
        var h = {
            connect: 1,
            connect_error: 1,
            connect_timeout: 1,
            connecting: 1,
            disconnect: 1,
            error: 1,
            reconnect: 1,
            reconnect_attempt: 1,
            reconnect_failed: 1,
            reconnect_error: 1,
            reconnecting: 1,
            ping: 1,
            pong: 1
        }
          , f = n.prototype.emit;
        function l(t, e, r) {
            this.io = t,
            this.nsp = e,
            (this.json = this).ids = 0,
            this.acks = {},
            this.receiveBuffer = [],
            this.sendBuffer = [],
            this.connected = !1,
            this.disconnected = !0,
            this.flags = {},
            r && r.query && (this.query = r.query),
            this.io.autoConnect && this.open()
        }
        n(l.prototype),
        l.prototype.subEvents = function() {
            var t;
            this.subs || (t = this.io,
            this.subs = [s(t, "open", a(this, "onopen")), s(t, "packet", a(this, "onpacket")), s(t, "close", a(this, "onclose"))])
        }
        ,
        l.prototype.open = l.prototype.connect = function() {
            return this.connected || (this.subEvents(),
            this.io.open(),
            "open" === this.io.readyState && this.onopen(),
            this.emit("connecting")),
            this
        }
        ,
        l.prototype.send = function() {
            var t = i(arguments);
            return t.unshift("message"),
            this.emit.apply(this, t),
            this
        }
        ,
        l.prototype.emit = function(t) {
            if (h.hasOwnProperty(t))
                return f.apply(this, arguments),
                this;
            var e = i(arguments)
              , r = {
                type: (void 0 !== this.flags.binary ? this.flags.binary : p(e)) ? o.BINARY_EVENT : o.EVENT,
                data: e,
                options: {}
            };
            return r.options.compress = !this.flags || !1 !== this.flags.compress,
            "function" == typeof e[e.length - 1] && (c("emitting packet with ack id %d", this.ids),
            this.acks[this.ids] = e.pop(),
            r.id = this.ids++),
            this.connected ? this.packet(r) : this.sendBuffer.push(r),
            this.flags = {},
            this
        }
        ,
        l.prototype.packet = function(t) {
            t.nsp = this.nsp,
            this.io.packet(t)
        }
        ,
        l.prototype.onopen = function() {
            var t;
            c("transport is open - connecting"),
            "/" !== this.nsp && (this.query ? (t = "object" == typeof this.query ? u.encode(this.query) : this.query,
            c("sending connect packet with query %s", t),
            this.packet({
                type: o.CONNECT,
                query: t
            })) : this.packet({
                type: o.CONNECT
            }))
        }
        ,
        l.prototype.onclose = function(t) {
            c("close (%s)", t),
            this.connected = !1,
            this.disconnected = !0,
            delete this.id,
            this.emit("disconnect", t)
        }
        ,
        l.prototype.onpacket = function(t) {
            var e = t.nsp === this.nsp
              , r = t.type === o.ERROR && "/" === t.nsp;
            if (e || r)
                switch (t.type) {
                case o.CONNECT:
                    this.onconnect();
                    break;
                case o.EVENT:
                case o.BINARY_EVENT:
                    this.onevent(t);
                    break;
                case o.ACK:
                case o.BINARY_ACK:
                    this.onack(t);
                    break;
                case o.DISCONNECT:
                    this.ondisconnect();
                    break;
                case o.ERROR:
                    this.emit("error", t.data)
                }
        }
        ,
        l.prototype.onevent = function(t) {
            var e = t.data || [];
            c("emitting event %j", e),
            null != t.id && (c("attaching ack callback to event"),
            e.push(this.ack(t.id))),
            this.connected ? f.apply(this, e) : this.receiveBuffer.push(e)
        }
        ,
        l.prototype.ack = function(e) {
            var r = this
              , n = !1;
            return function() {
                var t;
                n || (n = !0,
                t = i(arguments),
                c("sending ack %j", t),
                r.packet({
                    type: p(t) ? o.BINARY_ACK : o.ACK,
                    id: e,
                    data: t
                }))
            }
        }
        ,
        l.prototype.onack = function(t) {
            var e = this.acks[t.id];
            "function" == typeof e ? (c("calling ack %s with %j", t.id, t.data),
            e.apply(this, t.data),
            delete this.acks[t.id]) : c("bad ack %s", t.id)
        }
        ,
        l.prototype.onconnect = function() {
            this.connected = !0,
            this.disconnected = !1,
            this.emit("connect"),
            this.emitBuffered()
        }
        ,
        l.prototype.emitBuffered = function() {
            for (var t = 0; t < this.receiveBuffer.length; t++)
                f.apply(this, this.receiveBuffer[t]);
            for (this.receiveBuffer = [],
            t = 0; t < this.sendBuffer.length; t++)
                this.packet(this.sendBuffer[t]);
            this.sendBuffer = []
        }
        ,
        l.prototype.ondisconnect = function() {
            c("server disconnect (%s)", this.nsp),
            this.destroy(),
            this.onclose("io server disconnect")
        }
        ,
        l.prototype.destroy = function() {
            if (this.subs) {
                for (var t = 0; t < this.subs.length; t++)
                    this.subs[t].destroy();
                this.subs = null
            }
            this.io.destroy(this)
        }
        ,
        l.prototype.close = l.prototype.disconnect = function() {
            return this.connected && (c("performing disconnect (%s)", this.nsp),
            this.packet({
                type: o.DISCONNECT
            })),
            this.destroy(),
            this.connected && this.onclose("io client disconnect"),
            this
        }
        ,
        l.prototype.compress = function(t) {
            return this.flags.compress = t,
            this
        }
        ,
        l.prototype.binary = function(t) {
            return this.flags.binary = t,
            this
        }
    },
    162: function(t, e) {
        var n = [].indexOf;
        t.exports = function(t, e) {
            if (n)
                return t.indexOf(e);
            for (var r = 0; r < t.length; ++r)
                if (t[r] === e)
                    return r;
            return -1
        }
    },
    163: function(t, e, r) {
        "use strict";
        var n, o = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split(""), i = 64, s = {}, a = 0, c = 0;
        function u(t) {
            for (var e = ""; e = o[t % i] + e,
            0 < (t = Math.floor(t / i)); )
                ;
            return e
        }
        function p() {
            var t = u(+new Date);
            return t !== n ? (a = 0,
            n = t) : t + "." + u(a++)
        }
        for (; c < i; c++)
            s[o[c]] = c;
        p.encode = u,
        p.decode = function(t) {
            var e = 0;
            for (c = 0; c < t.length; c++)
                e = e * i + s[t.charAt(c)];
            return e
        }
        ,
        t.exports = p
    },
    164: function(e, t, r) {
        (function(i) {
            var s = r(3)
              , t = Object.prototype.toString
              , a = "function" == typeof Blob || "undefined" != typeof Blob && "[object BlobConstructor]" === t.call(Blob)
              , c = "function" == typeof File || "undefined" != typeof File && "[object FileConstructor]" === t.call(File);
            e.exports = function t(e) {
                if (!e || "object" != typeof e)
                    return !1;
                if (s(e)) {
                    for (var r = 0, n = e.length; r < n; r++)
                        if (t(e[r]))
                            return !0;
                    return !1
                }
                if ("function" == typeof i && i.isBuffer && i.isBuffer(e) || "function" == typeof ArrayBuffer && e instanceof ArrayBuffer || a && e instanceof Blob || c && e instanceof File)
                    return !0;
                if (e.toJSON && "function" == typeof e.toJSON && 1 === arguments.length)
                    return t(e.toJSON(), !0);
                for (var o in e)
                    if (Object.prototype.hasOwnProperty.call(e, o) && t(e[o]))
                        return !0;
                return !1
            }
        }
        ).call(this, r(8).Buffer)
    },
    165: function(t, e, r) {
        var n = r(152)
          , o = r(144)
          , i = r(12)
          , s = r(143)
          , a = r(163)
          , c = r(5)("engine.io-client:polling");
        t.exports = p;
        var u = null != new (r(153))({
            xdomain: !1
        }).responseType;
        function p(t) {
            var e = t && t.forceBase64;
            u && !e || (this.supportsBinary = !1),
            n.call(this, t)
        }
        s(p, n),
        p.prototype.name = "polling",
        p.prototype.doOpen = function() {
            this.poll()
        }
        ,
        p.prototype.pause = function(t) {
            var e, r = this;
            function n() {
                c("paused"),
                r.readyState = "paused",
                t()
            }
            this.readyState = "pausing",
            this.polling || !this.writable ? (e = 0,
            this.polling && (c("we are currently polling - waiting to pause"),
            e++,
            this.once("pollComplete", function() {
                c("pre-pause polling complete"),
                --e || n()
            })),
            this.writable || (c("we are currently writing - waiting to pause"),
            e++,
            this.once("drain", function() {
                c("pre-pause writing complete"),
                --e || n()
            }))) : n()
        }
        ,
        p.prototype.poll = function() {
            c("polling"),
            this.polling = !0,
            this.doPoll(),
            this.emit("poll")
        }
        ,
        p.prototype.onData = function(t) {
            var n = this;
            c("polling got data %s", t);
            i.decodePayload(t, this.socket.binaryType, function(t, e, r) {
                if ("opening" === n.readyState && n.onOpen(),
                "close" === t.type)
                    return n.onClose(),
                    !1;
                n.onPacket(t)
            }),
            "closed" !== this.readyState && (this.polling = !1,
            this.emit("pollComplete"),
            "open" === this.readyState ? this.poll() : c('ignoring poll - transport state "%s"', this.readyState))
        }
        ,
        p.prototype.doClose = function() {
            var t = this;
            function e() {
                c("writing close packet"),
                t.write([{
                    type: "close"
                }])
            }
            "open" === this.readyState ? (c("transport open - closing"),
            e()) : (c("transport not open - deferring close"),
            this.once("open", e))
        }
        ,
        p.prototype.write = function(t) {
            var e = this;
            this.writable = !1;
            function r() {
                e.writable = !0,
                e.emit("drain")
            }
            i.encodePayload(t, this.supportsBinary, function(t) {
                e.doWrite(t, r)
            })
        }
        ,
        p.prototype.uri = function() {
            var t = this.query || {}
              , e = this.secure ? "https" : "http"
              , r = "";
            return !1 !== this.timestampRequests && (t[this.timestampParam] = a()),
            this.supportsBinary || t.sid || (t.b64 = 1),
            t = o.encode(t),
            this.port && ("https" == e && 443 !== Number(this.port) || "http" == e && 80 !== Number(this.port)) && (r = ":" + this.port),
            t.length && (t = "?" + t),
            e + "://" + (-1 !== this.hostname.indexOf(":") ? "[" + this.hostname + "]" : this.hostname) + r + this.path + t
        }
    },
    166: function(t, e, r) {
        (function(s) {
            var a = r(153)
              , c = r(790)
              , u = r(783)
              , t = r(782);
            e.polling = function(t) {
                var e = !1
                  , r = !1
                  , n = !1 !== t.jsonp;
                {
                    var o, i;
                    s.location && (o = "https:" === location.protocol,
                    i = (i = location.port) || (o ? 443 : 80),
                    e = t.hostname !== location.hostname || i !== t.port,
                    r = t.secure !== o)
                }
                {
                    if (t.xdomain = e,
                    t.xscheme = r,
                    "open"in new a(t) && !t.forceJSONP)
                        return new c(t);
                    if (!n)
                        throw new Error("JSONP disabled");
                    return new u(t)
                }
            }
            ,
            e.websocket = t
        }
        ).call(this, r(1))
    },
    167: function(t, e, r) {
        var c = r(793)
          , i = r(161)
          , n = r(13)
          , o = r(154)
          , u = r(160)
          , s = r(159)
          , p = r(5)("socket.io-client:manager")
          , a = r(162)
          , h = r(779)
          , f = Object.prototype.hasOwnProperty;
        function l(t, e) {
            if (!(this instanceof l))
                return new l(t,e);
            t && "object" == typeof t && (e = t,
            t = void 0),
            (e = e || {}).path = e.path || "/socket.io",
            this.nsps = {},
            this.subs = [],
            this.opts = e,
            this.reconnection(!1 !== e.reconnection),
            this.reconnectionAttempts(e.reconnectionAttempts || 1 / 0),
            this.reconnectionDelay(e.reconnectionDelay || 1e3),
            this.reconnectionDelayMax(e.reconnectionDelayMax || 5e3),
            this.randomizationFactor(e.randomizationFactor || .5),
            this.backoff = new h({
                min: this.reconnectionDelay(),
                max: this.reconnectionDelayMax(),
                jitter: this.randomizationFactor()
            }),
            this.timeout(null == e.timeout ? 2e4 : e.timeout),
            this.readyState = "closed",
            this.uri = t,
            this.connecting = [],
            this.lastPing = null,
            this.encoding = !1,
            this.packetBuffer = [];
            var r = e.parser || o;
            this.encoder = new r.Encoder,
            this.decoder = new r.Decoder,
            this.autoConnect = !1 !== e.autoConnect,
            this.autoConnect && this.open()
        }
        (t.exports = l).prototype.emitAll = function() {
            for (var t in this.emit.apply(this, arguments),
            this.nsps)
                f.call(this.nsps, t) && this.nsps[t].emit.apply(this.nsps[t], arguments)
        }
        ,
        l.prototype.updateSocketIds = function() {
            for (var t in this.nsps)
                f.call(this.nsps, t) && (this.nsps[t].id = this.generateId(t))
        }
        ,
        l.prototype.generateId = function(t) {
            return ("/" === t ? "" : t + "#") + this.engine.id
        }
        ,
        n(l.prototype),
        l.prototype.reconnection = function(t) {
            return arguments.length ? (this._reconnection = !!t,
            this) : this._reconnection
        }
        ,
        l.prototype.reconnectionAttempts = function(t) {
            return arguments.length ? (this._reconnectionAttempts = t,
            this) : this._reconnectionAttempts
        }
        ,
        l.prototype.reconnectionDelay = function(t) {
            return arguments.length ? (this._reconnectionDelay = t,
            this.backoff && this.backoff.setMin(t),
            this) : this._reconnectionDelay
        }
        ,
        l.prototype.randomizationFactor = function(t) {
            return arguments.length ? (this._randomizationFactor = t,
            this.backoff && this.backoff.setJitter(t),
            this) : this._randomizationFactor
        }
        ,
        l.prototype.reconnectionDelayMax = function(t) {
            return arguments.length ? (this._reconnectionDelayMax = t,
            this.backoff && this.backoff.setMax(t),
            this) : this._reconnectionDelayMax
        }
        ,
        l.prototype.timeout = function(t) {
            return arguments.length ? (this._timeout = t,
            this) : this._timeout
        }
        ,
        l.prototype.maybeReconnectOnOpen = function() {
            !this.reconnecting && this._reconnection && 0 === this.backoff.attempts && this.reconnect()
        }
        ,
        l.prototype.open = l.prototype.connect = function(r, t) {
            if (p("readyState %s", this.readyState),
            ~this.readyState.indexOf("open"))
                return this;
            p("opening %s", this.uri),
            this.engine = c(this.uri, this.opts);
            var e = this.engine
              , n = this;
            this.readyState = "opening",
            this.skipReconnect = !1;
            var o, i, s = u(e, "open", function() {
                n.onopen(),
                r && r()
            }), a = u(e, "error", function(t) {
                var e;
                p("connect_error"),
                n.cleanup(),
                n.readyState = "closed",
                n.emitAll("connect_error", t),
                r ? ((e = new Error("Connection error")).data = t,
                r(e)) : n.maybeReconnectOnOpen()
            });
            return !1 !== this._timeout && (o = this._timeout,
            p("connect attempt will timeout after %d", o),
            i = setTimeout(function() {
                p("connect attempt timed out after %d", o),
                s.destroy(),
                e.close(),
                e.emit("error", "timeout"),
                n.emitAll("connect_timeout", o)
            }, o),
            this.subs.push({
                destroy: function() {
                    clearTimeout(i)
                }
            })),
            this.subs.push(s),
            this.subs.push(a),
            this
        }
        ,
        l.prototype.onopen = function() {
            p("open"),
            this.cleanup(),
            this.readyState = "open",
            this.emit("open");
            var t = this.engine;
            this.subs.push(u(t, "data", s(this, "ondata"))),
            this.subs.push(u(t, "ping", s(this, "onping"))),
            this.subs.push(u(t, "pong", s(this, "onpong"))),
            this.subs.push(u(t, "error", s(this, "onerror"))),
            this.subs.push(u(t, "close", s(this, "onclose"))),
            this.subs.push(u(this.decoder, "decoded", s(this, "ondecoded")))
        }
        ,
        l.prototype.onping = function() {
            this.lastPing = new Date,
            this.emitAll("ping")
        }
        ,
        l.prototype.onpong = function() {
            this.emitAll("pong", new Date - this.lastPing)
        }
        ,
        l.prototype.ondata = function(t) {
            this.decoder.add(t)
        }
        ,
        l.prototype.ondecoded = function(t) {
            this.emit("packet", t)
        }
        ,
        l.prototype.onerror = function(t) {
            p("error", t),
            this.emitAll("error", t)
        }
        ,
        l.prototype.socket = function(t, e) {
            var r, n = this.nsps[t];
            function o() {
                ~a(r.connecting, n) || r.connecting.push(n)
            }
            return n || (n = new i(this,t,e),
            this.nsps[t] = n,
            r = this,
            n.on("connecting", o),
            n.on("connect", function() {
                n.id = r.generateId(t)
            }),
            this.autoConnect && o()),
            n
        }
        ,
        l.prototype.destroy = function(t) {
            var e = a(this.connecting, t);
            ~e && this.connecting.splice(e, 1),
            this.connecting.length || this.close()
        }
        ,
        l.prototype.packet = function(r) {
            p("writing packet %j", r);
            var n = this;
            r.query && 0 === r.type && (r.nsp += "?" + r.query),
            n.encoding ? n.packetBuffer.push(r) : (n.encoding = !0,
            this.encoder.encode(r, function(t) {
                for (var e = 0; e < t.length; e++)
                    n.engine.write(t[e], r.options);
                n.encoding = !1,
                n.processPacketQueue()
            }))
        }
        ,
        l.prototype.processPacketQueue = function() {
            var t;
            0 < this.packetBuffer.length && !this.encoding && (t = this.packetBuffer.shift(),
            this.packet(t))
        }
        ,
        l.prototype.cleanup = function() {
            p("cleanup");
            for (var t = this.subs.length, e = 0; e < t; e++) {
                this.subs.shift().destroy()
            }
            this.packetBuffer = [],
            this.encoding = !1,
            this.lastPing = null,
            this.decoder.destroy()
        }
        ,
        l.prototype.close = l.prototype.disconnect = function() {
            p("disconnect"),
            this.skipReconnect = !0,
            this.reconnecting = !1,
            "opening" === this.readyState && this.cleanup(),
            this.backoff.reset(),
            this.readyState = "closed",
            this.engine && this.engine.close()
        }
        ,
        l.prototype.onclose = function(t) {
            p("onclose"),
            this.cleanup(),
            this.backoff.reset(),
            this.readyState = "closed",
            this.emit("close", t),
            this._reconnection && !this.skipReconnect && this.reconnect()
        }
        ,
        l.prototype.reconnect = function() {
            if (this.reconnecting || this.skipReconnect)
                return this;
            var t, e, r = this;
            this.backoff.attempts >= this._reconnectionAttempts ? (p("reconnect failed"),
            this.backoff.reset(),
            this.emitAll("reconnect_failed"),
            this.reconnecting = !1) : (t = this.backoff.duration(),
            p("will wait %dms before reconnect attempt", t),
            this.reconnecting = !0,
            e = setTimeout(function() {
                r.skipReconnect || (p("attempting reconnect"),
                r.emitAll("reconnect_attempt", r.backoff.attempts),
                r.emitAll("reconnecting", r.backoff.attempts),
                r.skipReconnect || r.open(function(t) {
                    t ? (p("reconnect attempt error"),
                    r.reconnecting = !1,
                    r.reconnect(),
                    r.emitAll("reconnect_error", t.data)) : (p("reconnect success"),
                    r.onreconnect())
                }))
            }, t),
            this.subs.push({
                destroy: function() {
                    clearTimeout(e)
                }
            }))
        }
        ,
        l.prototype.onreconnect = function() {
            var t = this.backoff.attempts;
            this.reconnecting = !1,
            this.backoff.reset(),
            this.updateSocketIds(),
            this.emitAll("reconnect", t)
        }
    },
    168: function(t, e, r) {
        (function(e) {
            t.exports = function(t) {
                return r && e.Buffer.isBuffer(t) || n && (t instanceof e.ArrayBuffer || o(t))
            }
            ;
            var r = "function" == typeof e.Buffer && "function" == typeof e.Buffer.isBuffer
              , n = "function" == typeof e.ArrayBuffer
              , o = n && "function" == typeof e.ArrayBuffer.isView ? e.ArrayBuffer.isView : function(t) {
                return t.buffer instanceof e.ArrayBuffer
            }
        }
        ).call(this, r(1))
    },
    169: function(t, e) {
        var a = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
          , c = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"];
        t.exports = function(t) {
            var e = t
              , r = t.indexOf("[")
              , n = t.indexOf("]");
            -1 != r && -1 != n && (t = t.substring(0, r) + t.substring(r, n).replace(/:/g, ";") + t.substring(n, t.length));
            for (var o = a.exec(t || ""), i = {}, s = 14; s--; )
                i[c[s]] = o[s] || "";
            return -1 != r && -1 != n && (i.source = e,
            i.host = i.host.substring(1, i.host.length - 1).replace(/;/g, ":"),
            i.authority = i.authority.replace("[", "").replace("]", "").replace(/;/g, ":"),
            i.ipv6uri = !0),
            i
        }
    },
    3: function(t, e) {
        var r = {}.toString;
        t.exports = Array.isArray || function(t) {
            return "[object Array]" == r.call(t)
        }
    },
    5: function(r, i, n) {
        (function(e) {
            function t() {
                var t;
                try {
                    t = i.storage.debug
                } catch (t) {}
                return !t && void 0 !== e && "env"in e && (t = e.env.DEBUG),
                t
            }
            (i = r.exports = n(796)).log = function() {
                return "object" == typeof console && console.log && Function.prototype.apply.call(console.log, console, arguments)
            }
            ,
            i.formatArgs = function(t) {
                var e = this.useColors;
                if (t[0] = (e ? "%c" : "") + this.namespace + (e ? " %c" : " ") + t[0] + (e ? "%c " : " ") + "+" + i.humanize(this.diff),
                !e)
                    return;
                var r = "color: " + this.color;
                t.splice(1, 0, r, "color: inherit");
                var n = 0
                  , o = 0;
                t[0].replace(/%[a-zA-Z%]/g, function(t) {
                    "%%" !== t && (n++,
                    "%c" === t && (o = n))
                }),
                t.splice(o, 0, r)
            }
            ,
            i.save = function(t) {
                try {
                    null == t ? i.storage.removeItem("debug") : i.storage.debug = t
                } catch (t) {}
            }
            ,
            i.load = t,
            i.useColors = function() {
                if ("undefined" != typeof window && window.process && "renderer" === window.process.type)
                    return !0;
                return "undefined" != typeof document && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || "undefined" != typeof window && window.console && (window.console.firebug || window.console.exception && window.console.table) || "undefined" != typeof navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && 31 <= parseInt(RegExp.$1, 10) || "undefined" != typeof navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/)
            }
            ,
            i.storage = "undefined" != typeof chrome && void 0 !== chrome.storage ? chrome.storage.local : function() {
                try {
                    return window.localStorage
                } catch (t) {}
            }(),
            i.colors = ["lightseagreen", "forestgreen", "goldenrod", "dodgerblue", "darkorchid", "crimson"],
            i.formatters.j = function(t) {
                try {
                    return JSON.stringify(t)
                } catch (t) {
                    return "[UnexpectedJSONParseError]: " + t.message
                }
            }
            ,
            i.enable(t())
        }
        ).call(this, n(15))
    },
    6: function(t, e) {
        e.read = function(t, e, r, n, o) {
            var i, s, a = 8 * o - n - 1, c = (1 << a) - 1, u = c >> 1, p = -7, h = r ? o - 1 : 0, f = r ? -1 : 1, l = t[e + h];
            for (h += f,
            i = l & (1 << -p) - 1,
            l >>= -p,
            p += a; 0 < p; i = 256 * i + t[e + h],
            h += f,
            p -= 8)
                ;
            for (s = i & (1 << -p) - 1,
            i >>= -p,
            p += n; 0 < p; s = 256 * s + t[e + h],
            h += f,
            p -= 8)
                ;
            if (0 === i)
                i = 1 - u;
            else {
                if (i === c)
                    return s ? NaN : 1 / 0 * (l ? -1 : 1);
                s += Math.pow(2, n),
                i -= u
            }
            return (l ? -1 : 1) * s * Math.pow(2, i - n)
        }
        ,
        e.write = function(t, e, r, n, o, i) {
            var s, a, c, u = 8 * i - o - 1, p = (1 << u) - 1, h = p >> 1, f = 23 === o ? Math.pow(2, -24) - Math.pow(2, -77) : 0, l = n ? 0 : i - 1, d = n ? 1 : -1, y = e < 0 || 0 === e && 1 / e < 0 ? 1 : 0;
            for (e = Math.abs(e),
            isNaN(e) || e === 1 / 0 ? (a = isNaN(e) ? 1 : 0,
            s = p) : (s = Math.floor(Math.log(e) / Math.LN2),
            e * (c = Math.pow(2, -s)) < 1 && (s--,
            c *= 2),
            2 <= (e += 1 <= s + h ? f / c : f * Math.pow(2, 1 - h)) * c && (s++,
            c /= 2),
            p <= s + h ? (a = 0,
            s = p) : 1 <= s + h ? (a = (e * c - 1) * Math.pow(2, o),
            s += h) : (a = e * Math.pow(2, h - 1) * Math.pow(2, o),
            s = 0)); 8 <= o; t[r + l] = 255 & a,
            l += d,
            a /= 256,
            o -= 8)
                ;
            for (s = s << o | a,
            u += o; 0 < u; t[r + l] = 255 & s,
            l += d,
            s /= 256,
            u -= 8)
                ;
            t[r + l - d] |= 128 * y
        }
    },
    7: function(t, e, r) {
        "use strict";
        e.byteLength = function(t) {
            var e = h(t)
              , r = e[0]
              , n = e[1];
            return 3 * (r + n) / 4 - n
        }
        ,
        e.toByteArray = function(t) {
            var e, r, n = h(t), o = n[0], i = n[1], s = new p(function(t, e) {
                return 3 * (t + e) / 4 - e
            }(o, i)), a = 0, c = 0 < i ? o - 4 : o;
            for (r = 0; r < c; r += 4)
                e = u[t.charCodeAt(r)] << 18 | u[t.charCodeAt(r + 1)] << 12 | u[t.charCodeAt(r + 2)] << 6 | u[t.charCodeAt(r + 3)],
                s[a++] = e >> 16 & 255,
                s[a++] = e >> 8 & 255,
                s[a++] = 255 & e;
            2 === i && (e = u[t.charCodeAt(r)] << 2 | u[t.charCodeAt(r + 1)] >> 4,
            s[a++] = 255 & e);
            1 === i && (e = u[t.charCodeAt(r)] << 10 | u[t.charCodeAt(r + 1)] << 4 | u[t.charCodeAt(r + 2)] >> 2,
            s[a++] = e >> 8 & 255,
            s[a++] = 255 & e);
            return s
        }
        ,
        e.fromByteArray = function(t) {
            for (var e, r = t.length, n = r % 3, o = [], i = 0, s = r - n; i < s; i += 16383)
                o.push(function(t, e, r) {
                    for (var n, o = [], i = e; i < r; i += 3)
                        n = (t[i] << 16 & 16711680) + (t[i + 1] << 8 & 65280) + (255 & t[i + 2]),
                        o.push(function(t) {
                            return a[t >> 18 & 63] + a[t >> 12 & 63] + a[t >> 6 & 63] + a[63 & t]
                        }(n));
                    return o.join("")
                }(t, i, s < i + 16383 ? s : i + 16383));
            1 == n ? (e = t[r - 1],
            o.push(a[e >> 2] + a[e << 4 & 63] + "==")) : 2 == n && (e = (t[r - 2] << 8) + t[r - 1],
            o.push(a[e >> 10] + a[e >> 4 & 63] + a[e << 2 & 63] + "="));
            return o.join("")
        }
        ;
        for (var a = [], u = [], p = "undefined" != typeof Uint8Array ? Uint8Array : Array, n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", o = 0, i = n.length; o < i; ++o)
            a[o] = n[o],
            u[n.charCodeAt(o)] = o;
        function h(t) {
            var e = t.length;
            if (0 < e % 4)
                throw new Error("Invalid string. Length must be a multiple of 4");
            var r = t.indexOf("=");
            return -1 === r && (r = e),
            [r, r === e ? 0 : 4 - r % 4]
        }
        u["-".charCodeAt(0)] = 62,
        u["_".charCodeAt(0)] = 63
    },
    779: function(t, e) {
        function r(t) {
            t = t || {},
            this.ms = t.min || 100,
            this.max = t.max || 1e4,
            this.factor = t.factor || 2,
            this.jitter = 0 < t.jitter && t.jitter <= 1 ? t.jitter : 0,
            this.attempts = 0
        }
        (t.exports = r).prototype.duration = function() {
            var t, e, r = this.ms * Math.pow(this.factor, this.attempts++);
            return this.jitter && (t = Math.random(),
            e = Math.floor(t * this.jitter * r),
            r = 0 == (1 & Math.floor(10 * t)) ? r - e : r + e),
            0 | Math.min(r, this.max)
        }
        ,
        r.prototype.reset = function() {
            this.attempts = 0
        }
        ,
        r.prototype.setMin = function(t) {
            this.ms = t
        }
        ,
        r.prototype.setMax = function(t) {
            this.max = t
        }
        ,
        r.prototype.setJitter = function(t) {
            this.jitter = t
        }
    },
    780: function(t, e) {
        t.exports = function(t, e) {
            for (var r = [], n = (e = e || 0) || 0; n < t.length; n++)
                r[n - e] = t[n];
            return r
        }
    },
    781: function(t, e) {},
    782: function(h, t, f) {
        (function(i) {
            var e, r = f(152), s = f(12), n = f(144), t = f(143), o = f(163), a = f(5)("engine.io-client:websocket"), c = i.WebSocket || i.MozWebSocket;
            if ("undefined" == typeof window)
                try {
                    e = f(781)
                } catch (t) {}
            var u = c;
            function p(t) {
                t && t.forceBase64 && (this.supportsBinary = !1),
                this.perMessageDeflate = t.perMessageDeflate,
                this.usingBrowserWebSocket = c && !t.forceNode,
                this.protocols = t.protocols,
                this.usingBrowserWebSocket || (u = e),
                r.call(this, t)
            }
            u || "undefined" != typeof window || (u = e),
            t(h.exports = p, r),
            p.prototype.name = "websocket",
            p.prototype.supportsBinary = !0,
            p.prototype.doOpen = function() {
                if (this.check()) {
                    var t = this.uri()
                      , e = this.protocols
                      , r = {
                        agent: this.agent,
                        perMessageDeflate: this.perMessageDeflate
                    };
                    r.pfx = this.pfx,
                    r.key = this.key,
                    r.passphrase = this.passphrase,
                    r.cert = this.cert,
                    r.ca = this.ca,
                    r.ciphers = this.ciphers,
                    r.rejectUnauthorized = this.rejectUnauthorized,
                    this.extraHeaders && (r.headers = this.extraHeaders),
                    this.localAddress && (r.localAddress = this.localAddress);
                    try {
                        this.ws = this.usingBrowserWebSocket ? e ? new u(t,e) : new u(t) : new u(t,e,r)
                    } catch (t) {
                        return this.emit("error", t)
                    }
                    void 0 === this.ws.binaryType && (this.supportsBinary = !1),
                    this.ws.supports && this.ws.supports.binary ? (this.supportsBinary = !0,
                    this.ws.binaryType = "nodebuffer") : this.ws.binaryType = "arraybuffer",
                    this.addEventListeners()
                }
            }
            ,
            p.prototype.addEventListeners = function() {
                var e = this;
                this.ws.onopen = function() {
                    e.onOpen()
                }
                ,
                this.ws.onclose = function() {
                    e.onClose()
                }
                ,
                this.ws.onmessage = function(t) {
                    e.onData(t.data)
                }
                ,
                this.ws.onerror = function(t) {
                    e.onError("websocket error", t)
                }
            }
            ,
            p.prototype.write = function(t) {
                var n = this;
                this.writable = !1;
                for (var o = t.length, e = 0, r = o; e < r; e++)
                    !function(r) {
                        s.encodePacket(r, n.supportsBinary, function(t) {
                            var e;
                            n.usingBrowserWebSocket || (e = {},
                            r.options && (e.compress = r.options.compress),
                            n.perMessageDeflate && ("string" == typeof t ? i.Buffer.byteLength(t) : t.length) < n.perMessageDeflate.threshold && (e.compress = !1));
                            try {
                                n.usingBrowserWebSocket ? n.ws.send(t) : n.ws.send(t, e)
                            } catch (t) {
                                a("websocket closed before onclose event")
                            }
                            --o || (n.emit("flush"),
                            setTimeout(function() {
                                n.writable = !0,
                                n.emit("drain")
                            }, 0))
                        })
                    }(t[e])
            }
            ,
            p.prototype.onClose = function() {
                r.prototype.onClose.call(this)
            }
            ,
            p.prototype.doClose = function() {
                void 0 !== this.ws && this.ws.close()
            }
            ,
            p.prototype.uri = function() {
                var t = this.query || {}
                  , e = this.secure ? "wss" : "ws"
                  , r = "";
                return this.port && ("wss" == e && 443 !== Number(this.port) || "ws" == e && 80 !== Number(this.port)) && (r = ":" + this.port),
                this.timestampRequests && (t[this.timestampParam] = o()),
                this.supportsBinary || (t.b64 = 1),
                (t = n.encode(t)).length && (t = "?" + t),
                e + "://" + (-1 !== this.hostname.indexOf(":") ? "[" + this.hostname + "]" : this.hostname) + r + this.path + t
            }
            ,
            p.prototype.check = function() {
                return !(!u || "__initialize"in u && this.name === p.prototype.name)
            }
        }
        ).call(this, f(1))
    },
    783: function(s, t, a) {
        (function(r) {
            var n = a(165)
              , t = a(143);
            s.exports = e;
            var o, u = /\n/g, p = /\\n/g;
            function i() {}
            function e(t) {
                n.call(this, t),
                this.query = this.query || {},
                o || (r.___eio || (r.___eio = []),
                o = r.___eio),
                this.index = o.length;
                var e = this;
                o.push(function(t) {
                    e.onData(t)
                }),
                this.query.j = this.index,
                r.document && r.addEventListener && r.addEventListener("beforeunload", function() {
                    e.script && (e.script.onerror = i)
                }, !1)
            }
            t(e, n),
            e.prototype.supportsBinary = !1,
            e.prototype.doClose = function() {
                this.script && (this.script.parentNode.removeChild(this.script),
                this.script = null),
                this.form && (this.form.parentNode.removeChild(this.form),
                this.form = null,
                this.iframe = null),
                n.prototype.doClose.call(this)
            }
            ,
            e.prototype.doPoll = function() {
                var e = this
                  , t = document.createElement("script");
                this.script && (this.script.parentNode.removeChild(this.script),
                this.script = null),
                t.async = !0,
                t.src = this.uri(),
                t.onerror = function(t) {
                    e.onError("jsonp poll error", t)
                }
                ;
                var r = document.getElementsByTagName("script")[0];
                r ? r.parentNode.insertBefore(t, r) : (document.head || document.body).appendChild(t),
                this.script = t,
                "undefined" != typeof navigator && /gecko/i.test(navigator.userAgent) && setTimeout(function() {
                    var t = document.createElement("iframe");
                    document.body.appendChild(t),
                    document.body.removeChild(t)
                }, 100)
            }
            ,
            e.prototype.doWrite = function(t, e) {
                var r, n, o, i, s = this;
                function a() {
                    c(),
                    e()
                }
                function c() {
                    if (s.iframe)
                        try {
                            s.form.removeChild(s.iframe)
                        } catch (t) {
                            s.onError("jsonp polling iframe removal error", t)
                        }
                    try {
                        var t = '<iframe src="javascript:0" name="' + s.iframeId + '">';
                        i = document.createElement(t)
                    } catch (t) {
                        (i = document.createElement("iframe")).name = s.iframeId,
                        i.src = "javascript:0"
                    }
                    i.id = s.iframeId,
                    s.form.appendChild(i),
                    s.iframe = i
                }
                this.form || (r = document.createElement("form"),
                n = document.createElement("textarea"),
                o = this.iframeId = "eio_iframe_" + this.index,
                r.className = "socketio",
                r.style.position = "absolute",
                r.style.top = "-1000px",
                r.style.left = "-1000px",
                r.target = o,
                r.method = "POST",
                r.setAttribute("accept-charset", "utf-8"),
                n.name = "d",
                r.appendChild(n),
                document.body.appendChild(r),
                this.form = r,
                this.area = n),
                this.form.action = this.uri(),
                c(),
                t = t.replace(p, "\\\n"),
                this.area.value = t.replace(u, "\\n");
                try {
                    this.form.submit()
                } catch (t) {}
                this.iframe.attachEvent ? this.iframe.onreadystatechange = function() {
                    "complete" === s.iframe.readyState && a()
                }
                : this.iframe.onload = a
            }
        }
        ).call(this, a(1))
    },
    784: function(t, e) {
        var n = void 0 !== n ? n : "undefined" != typeof WebKitBlobBuilder ? WebKitBlobBuilder : "undefined" != typeof MSBlobBuilder ? MSBlobBuilder : "undefined" != typeof MozBlobBuilder && MozBlobBuilder
          , r = function() {
            try {
                return 2 === new Blob(["hi"]).size
            } catch (t) {
                return !1
            }
        }()
          , o = r && function() {
            try {
                return 2 === new Blob([new Uint8Array([1, 2])]).size
            } catch (t) {
                return !1
            }
        }()
          , i = n && n.prototype.append && n.prototype.getBlob;
        function s(t) {
            return t.map(function(t) {
                if (t.buffer instanceof ArrayBuffer) {
                    var e, r = t.buffer;
                    return t.byteLength !== r.byteLength && ((e = new Uint8Array(t.byteLength)).set(new Uint8Array(r,t.byteOffset,t.byteLength)),
                    r = e.buffer),
                    r
                }
                return t
            })
        }
        function a(t, e) {
            e = e || {};
            var r = new n;
            return s(t).forEach(function(t) {
                r.append(t)
            }),
            e.type ? r.getBlob(e.type) : r.getBlob()
        }
        function c(t, e) {
            return new Blob(s(t),e || {})
        }
        "undefined" != typeof Blob && (a.prototype = Blob.prototype,
        c.prototype = Blob.prototype),
        t.exports = r ? o ? Blob : c : i ? a : void 0
    },
    785: function(t, e) {
        !function() {
            "use strict";
            for (var i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", h = new Uint8Array(256), t = 0; t < i.length; t++)
                h[i.charCodeAt(t)] = t;
            e.encode = function(t) {
                for (var e = new Uint8Array(t), r = e.length, n = "", o = 0; o < r; o += 3)
                    n += i[e[o] >> 2],
                    n += i[(3 & e[o]) << 4 | e[o + 1] >> 4],
                    n += i[(15 & e[o + 1]) << 2 | e[o + 2] >> 6],
                    n += i[63 & e[o + 2]];
                return r % 3 == 2 ? n = n.substring(0, n.length - 1) + "=" : r % 3 == 1 && (n = n.substring(0, n.length - 2) + "=="),
                n
            }
            ,
            e.decode = function(t) {
                var e, r, n, o, i = .75 * t.length, s = t.length, a = 0;
                "=" === t[t.length - 1] && (i--,
                "=" === t[t.length - 2] && i--);
                for (var c = new ArrayBuffer(i), u = new Uint8Array(c), p = 0; p < s; p += 4)
                    e = h[t.charCodeAt(p)],
                    r = h[t.charCodeAt(p + 1)],
                    n = h[t.charCodeAt(p + 2)],
                    o = h[t.charCodeAt(p + 3)],
                    u[a++] = e << 2 | r >> 4,
                    u[a++] = (15 & r) << 4 | n >> 2,
                    u[a++] = (3 & n) << 6 | 63 & o;
                return c
            }
        }()
    },
    786: function(t, e) {
        /*! https://mths.be/utf8js v2.1.2 by @mathias */
        var i, s, a, c = String.fromCharCode;
        function u(t) {
            for (var e, r, n = [], o = 0, i = t.length; o < i; )
                55296 <= (e = t.charCodeAt(o++)) && e <= 56319 && o < i ? 56320 == (64512 & (r = t.charCodeAt(o++))) ? n.push(((1023 & e) << 10) + (1023 & r) + 65536) : (n.push(e),
                o--) : n.push(e);
            return n
        }
        function p(t, e) {
            if (!(55296 <= t && t <= 57343))
                return 1;
            if (e)
                throw Error("Lone surrogate U+" + t.toString(16).toUpperCase() + " is not a scalar value")
        }
        function h(t, e) {
            return c(t >> e & 63 | 128)
        }
        function f() {
            if (s <= a)
                throw Error("Invalid byte index");
            var t = 255 & i[a];
            if (a++,
            128 == (192 & t))
                return 63 & t;
            throw Error("Invalid continuation byte")
        }
        t.exports = {
            version: "2.1.2",
            encode: function(t, e) {
                for (var r = !1 !== (e = e || {}).strict, n = u(t), o = n.length, i = -1, s = ""; ++i < o; )
                    s += function(t, e) {
                        if (0 == (4294967168 & t))
                            return c(t);
                        var r = "";
                        return 0 == (4294965248 & t) ? r = c(t >> 6 & 31 | 192) : 0 == (4294901760 & t) ? (p(t, e) || (t = 65533),
                        r = c(t >> 12 & 15 | 224),
                        r += h(t, 6)) : 0 == (4292870144 & t) && (r = c(t >> 18 & 7 | 240),
                        r += h(t, 12),
                        r += h(t, 6)),
                        r += c(63 & t | 128)
                    }(n[i], r);
                return s
            },
            decode: function(t, e) {
                var r = !1 !== (e = e || {}).strict;
                i = u(t),
                s = i.length,
                a = 0;
                for (var n, o = []; !1 !== (n = function(t) {
                    var e, r;
                    if (s < a)
                        throw Error("Invalid byte index");
                    if (a == s)
                        return !1;
                    if (e = 255 & i[a],
                    a++,
                    0 == (128 & e))
                        return e;
                    if (192 == (224 & e)) {
                        if (128 <= (r = (31 & e) << 6 | f()))
                            return r;
                        throw Error("Invalid continuation byte")
                    }
                    if (224 == (240 & e)) {
                        if (2048 <= (r = (15 & e) << 12 | f() << 6 | f()))
                            return p(r, t) ? r : 65533;
                        throw Error("Invalid continuation byte")
                    }
                    if (240 == (248 & e) && 65536 <= (r = (7 & e) << 18 | f() << 12 | f() << 6 | f()) && r <= 1114111)
                        return r;
                    throw Error("Invalid UTF-8 detected")
                }(r)); )
                    o.push(n);
                return function(t) {
                    for (var e, r = t.length, n = -1, o = ""; ++n < r; )
                        65535 < (e = t[n]) && (o += c((e -= 65536) >>> 10 & 1023 | 55296),
                        e = 56320 | 1023 & e),
                        o += c(e);
                    return o
                }(o)
            }
        }
    },
    787: function(t, e) {
        function s() {}
        t.exports = function(t, r, n) {
            var o = !1;
            return n = n || s,
            0 === (i.count = t) ? r() : i;
            function i(t, e) {
                if (i.count <= 0)
                    throw new Error("after called too many times");
                --i.count,
                t ? (o = !0,
                r(t),
                r = n) : 0 !== i.count || o || r(null, e)
            }
        }
    },
    788: function(t, e) {
        t.exports = function(t, e, r) {
            var n = t.byteLength;
            if (e = e || 0,
            r = r || n,
            t.slice)
                return t.slice(e, r);
            if (e < 0 && (e += n),
            r < 0 && (r += n),
            n < r && (r = n),
            n <= e || r <= e || 0 === n)
                return new ArrayBuffer(0);
            for (var o = new Uint8Array(t), i = new Uint8Array(r - e), s = e, a = 0; s < r; s++,
            a++)
                i[a] = o[s];
            return i.buffer
        }
    },
    789: function(t, e) {
        t.exports = Object.keys || function(t) {
            var e = []
              , r = Object.prototype.hasOwnProperty;
            for (var n in t)
                r.call(t, n) && e.push(n);
            return e
        }
    },
    790: function(p, t, h) {
        (function(o) {
            var i = h(153)
              , n = h(165)
              , t = h(13)
              , e = h(143)
              , s = h(5)("engine.io-client:polling-xhr");
            function r() {}
            function a(t) {
                var e, r;
                n.call(this, t),
                this.requestTimeout = t.requestTimeout,
                this.extraHeaders = t.extraHeaders,
                o.location && (e = "https:" === location.protocol,
                r = (r = location.port) || (e ? 443 : 80),
                this.xd = t.hostname !== o.location.hostname || r !== t.port,
                this.xs = t.secure !== e)
            }
            function c(t) {
                this.method = t.method || "GET",
                this.uri = t.uri,
                this.xd = !!t.xd,
                this.xs = !!t.xs,
                this.async = !1 !== t.async,
                this.data = void 0 !== t.data ? t.data : null,
                this.agent = t.agent,
                this.isBinary = t.isBinary,
                this.supportsBinary = t.supportsBinary,
                this.enablesXDR = t.enablesXDR,
                this.requestTimeout = t.requestTimeout,
                this.pfx = t.pfx,
                this.key = t.key,
                this.passphrase = t.passphrase,
                this.cert = t.cert,
                this.ca = t.ca,
                this.ciphers = t.ciphers,
                this.rejectUnauthorized = t.rejectUnauthorized,
                this.extraHeaders = t.extraHeaders,
                this.create()
            }
            function u() {
                for (var t in c.requests)
                    c.requests.hasOwnProperty(t) && c.requests[t].abort()
            }
            p.exports = a,
            p.exports.Request = c,
            e(a, n),
            a.prototype.supportsBinary = !0,
            a.prototype.request = function(t) {
                return (t = t || {}).uri = this.uri(),
                t.xd = this.xd,
                t.xs = this.xs,
                t.agent = this.agent || !1,
                t.supportsBinary = this.supportsBinary,
                t.enablesXDR = this.enablesXDR,
                t.pfx = this.pfx,
                t.key = this.key,
                t.passphrase = this.passphrase,
                t.cert = this.cert,
                t.ca = this.ca,
                t.ciphers = this.ciphers,
                t.rejectUnauthorized = this.rejectUnauthorized,
                t.requestTimeout = this.requestTimeout,
                t.extraHeaders = this.extraHeaders,
                new c(t)
            }
            ,
            a.prototype.doWrite = function(t, e) {
                var r = "string" != typeof t && void 0 !== t
                  , n = this.request({
                    method: "POST",
                    data: t,
                    isBinary: r
                })
                  , o = this;
                n.on("success", e),
                n.on("error", function(t) {
                    o.onError("xhr post error", t)
                }),
                this.sendXhr = n
            }
            ,
            a.prototype.doPoll = function() {
                s("xhr poll");
                var t = this.request()
                  , e = this;
                t.on("data", function(t) {
                    e.onData(t)
                }),
                t.on("error", function(t) {
                    e.onError("xhr poll error", t)
                }),
                this.pollXhr = t
            }
            ,
            t(c.prototype),
            c.prototype.create = function() {
                var t = {
                    agent: this.agent,
                    xdomain: this.xd,
                    xscheme: this.xs,
                    enablesXDR: this.enablesXDR
                };
                t.pfx = this.pfx,
                t.key = this.key,
                t.passphrase = this.passphrase,
                t.cert = this.cert,
                t.ca = this.ca,
                t.ciphers = this.ciphers,
                t.rejectUnauthorized = this.rejectUnauthorized;
                var e = this.xhr = new i(t)
                  , r = this;
                try {
                    s("xhr open %s: %s", this.method, this.uri),
                    e.open(this.method, this.uri, this.async);
                    try {
                        if (this.extraHeaders)
                            for (var n in e.setDisableHeaderCheck && e.setDisableHeaderCheck(!0),
                            this.extraHeaders)
                                this.extraHeaders.hasOwnProperty(n) && e.setRequestHeader(n, this.extraHeaders[n])
                    } catch (t) {}
                    if ("POST" === this.method)
                        try {
                            this.isBinary ? e.setRequestHeader("Content-type", "application/octet-stream") : e.setRequestHeader("Content-type", "text/plain;charset=UTF-8")
                        } catch (t) {}
                    try {
                        e.setRequestHeader("Accept", "*/*")
                    } catch (t) {}
                    "withCredentials"in e && (e.withCredentials = !0),
                    this.requestTimeout && (e.timeout = this.requestTimeout),
                    this.hasXDR() ? (e.onload = function() {
                        r.onLoad()
                    }
                    ,
                    e.onerror = function() {
                        r.onError(e.responseText)
                    }
                    ) : e.onreadystatechange = function() {
                        if (2 === e.readyState)
                            try {
                                var t = e.getResponseHeader("Content-Type");
                                r.supportsBinary && "application/octet-stream" === t && (e.responseType = "arraybuffer")
                            } catch (t) {}
                        4 === e.readyState && (200 === e.status || 1223 === e.status ? r.onLoad() : setTimeout(function() {
                            r.onError(e.status)
                        }, 0))
                    }
                    ,
                    s("xhr data %s", this.data),
                    e.send(this.data)
                } catch (t) {
                    return void setTimeout(function() {
                        r.onError(t)
                    }, 0)
                }
                o.document && (this.index = c.requestsCount++,
                c.requests[this.index] = this)
            }
            ,
            c.prototype.onSuccess = function() {
                this.emit("success"),
                this.cleanup()
            }
            ,
            c.prototype.onData = function(t) {
                this.emit("data", t),
                this.onSuccess()
            }
            ,
            c.prototype.onError = function(t) {
                this.emit("error", t),
                this.cleanup(!0)
            }
            ,
            c.prototype.cleanup = function(t) {
                if (void 0 !== this.xhr && null !== this.xhr) {
                    if (this.hasXDR() ? this.xhr.onload = this.xhr.onerror = r : this.xhr.onreadystatechange = r,
                    t)
                        try {
                            this.xhr.abort()
                        } catch (t) {}
                    o.document && delete c.requests[this.index],
                    this.xhr = null
                }
            }
            ,
            c.prototype.onLoad = function() {
                var t, e;
                try {
                    try {
                        e = this.xhr.getResponseHeader("Content-Type")
                    } catch (t) {}
                    t = "application/octet-stream" === e && this.xhr.response || this.xhr.responseText
                } catch (t) {
                    this.onError(t)
                }
                null != t && this.onData(t)
            }
            ,
            c.prototype.hasXDR = function() {
                return void 0 !== o.XDomainRequest && !this.xs && this.enablesXDR
            }
            ,
            c.prototype.abort = function() {
                this.cleanup()
            }
            ,
            c.requestsCount = 0,
            c.requests = {},
            o.document && (o.attachEvent ? o.attachEvent("onunload", u) : o.addEventListener && o.addEventListener("beforeunload", u, !1))
        }
        ).call(this, h(1))
    },
    791: function(e, t) {
        try {
            e.exports = "undefined" != typeof XMLHttpRequest && "withCredentials"in new XMLHttpRequest
        } catch (t) {
            e.exports = !1
        }
    },
    792: function(e, t, r) {
        (function(n) {
            var o = r(166)
              , t = r(13)
              , h = r(5)("engine.io-client:socket")
              , i = r(162)
              , s = r(12)
              , a = r(169)
              , c = r(144);
            function f(t, e) {
                if (!(this instanceof f))
                    return new f(t,e);
                e = e || {},
                t && "object" == typeof t && (e = t,
                t = null),
                t ? (t = a(t),
                e.hostname = t.host,
                e.secure = "https" === t.protocol || "wss" === t.protocol,
                e.port = t.port,
                t.query && (e.query = t.query)) : e.host && (e.hostname = a(e.host).host),
                this.secure = null != e.secure ? e.secure : n.location && "https:" === location.protocol,
                e.hostname && !e.port && (e.port = this.secure ? "443" : "80"),
                this.agent = e.agent || !1,
                this.hostname = e.hostname || (n.location ? location.hostname : "localhost"),
                this.port = e.port || (n.location && location.port ? location.port : this.secure ? 443 : 80),
                this.query = e.query || {},
                "string" == typeof this.query && (this.query = c.decode(this.query)),
                this.upgrade = !1 !== e.upgrade,
                this.path = (e.path || "/engine.io").replace(/\/$/, "") + "/",
                this.forceJSONP = !!e.forceJSONP,
                this.jsonp = !1 !== e.jsonp,
                this.forceBase64 = !!e.forceBase64,
                this.enablesXDR = !!e.enablesXDR,
                this.timestampParam = e.timestampParam || "t",
                this.timestampRequests = e.timestampRequests,
                this.transports = e.transports || ["polling", "websocket"],
                this.transportOptions = e.transportOptions || {},
                this.readyState = "",
                this.writeBuffer = [],
                this.prevBufferLen = 0,
                this.policyPort = e.policyPort || 843,
                this.rememberUpgrade = e.rememberUpgrade || !1,
                this.binaryType = null,
                this.onlyBinaryUpgrades = e.onlyBinaryUpgrades,
                this.perMessageDeflate = !1 !== e.perMessageDeflate && (e.perMessageDeflate || {}),
                !0 === this.perMessageDeflate && (this.perMessageDeflate = {}),
                this.perMessageDeflate && null == this.perMessageDeflate.threshold && (this.perMessageDeflate.threshold = 1024),
                this.pfx = e.pfx || null,
                this.key = e.key || null,
                this.passphrase = e.passphrase || null,
                this.cert = e.cert || null,
                this.ca = e.ca || null,
                this.ciphers = e.ciphers || null,
                this.rejectUnauthorized = void 0 === e.rejectUnauthorized || e.rejectUnauthorized,
                this.forceNode = !!e.forceNode;
                var r = "object" == typeof n && n;
                r.global === r && (e.extraHeaders && 0 < Object.keys(e.extraHeaders).length && (this.extraHeaders = e.extraHeaders),
                e.localAddress && (this.localAddress = e.localAddress)),
                this.id = null,
                this.upgrades = null,
                this.pingInterval = null,
                this.pingTimeout = null,
                this.pingIntervalTimer = null,
                this.pingTimeoutTimer = null,
                this.open()
            }
            (e.exports = f).priorWebsocketSuccess = !1,
            t(f.prototype),
            f.protocol = s.protocol,
            (f.Socket = f).Transport = r(152),
            f.transports = r(166),
            f.parser = r(12),
            f.prototype.createTransport = function(t) {
                h('creating transport "%s"', t);
                var e = function(t) {
                    var e = {};
                    for (var r in t)
                        t.hasOwnProperty(r) && (e[r] = t[r]);
                    return e
                }(this.query);
                e.EIO = s.protocol,
                e.transport = t;
                var r = this.transportOptions[t] || {};
                return this.id && (e.sid = this.id),
                new o[t]({
                    query: e,
                    socket: this,
                    agent: r.agent || this.agent,
                    hostname: r.hostname || this.hostname,
                    port: r.port || this.port,
                    secure: r.secure || this.secure,
                    path: r.path || this.path,
                    forceJSONP: r.forceJSONP || this.forceJSONP,
                    jsonp: r.jsonp || this.jsonp,
                    forceBase64: r.forceBase64 || this.forceBase64,
                    enablesXDR: r.enablesXDR || this.enablesXDR,
                    timestampRequests: r.timestampRequests || this.timestampRequests,
                    timestampParam: r.timestampParam || this.timestampParam,
                    policyPort: r.policyPort || this.policyPort,
                    pfx: r.pfx || this.pfx,
                    key: r.key || this.key,
                    passphrase: r.passphrase || this.passphrase,
                    cert: r.cert || this.cert,
                    ca: r.ca || this.ca,
                    ciphers: r.ciphers || this.ciphers,
                    rejectUnauthorized: r.rejectUnauthorized || this.rejectUnauthorized,
                    perMessageDeflate: r.perMessageDeflate || this.perMessageDeflate,
                    extraHeaders: r.extraHeaders || this.extraHeaders,
                    forceNode: r.forceNode || this.forceNode,
                    localAddress: r.localAddress || this.localAddress,
                    requestTimeout: r.requestTimeout || this.requestTimeout,
                    protocols: r.protocols || void 0
                })
            }
            ,
            f.prototype.open = function() {
                var t;
                if (this.rememberUpgrade && f.priorWebsocketSuccess && -1 !== this.transports.indexOf("websocket"))
                    t = "websocket";
                else {
                    if (0 === this.transports.length) {
                        var e = this;
                        return void setTimeout(function() {
                            e.emit("error", "No transports available")
                        }, 0)
                    }
                    t = this.transports[0]
                }
                this.readyState = "opening";
                try {
                    t = this.createTransport(t)
                } catch (t) {
                    return this.transports.shift(),
                    void this.open()
                }
                t.open(),
                this.setTransport(t)
            }
            ,
            f.prototype.setTransport = function(t) {
                h("setting transport %s", t.name);
                var e = this;
                this.transport && (h("clearing existing transport %s", this.transport.name),
                this.transport.removeAllListeners()),
                (this.transport = t).on("drain", function() {
                    e.onDrain()
                }).on("packet", function(t) {
                    e.onPacket(t)
                }).on("error", function(t) {
                    e.onError(t)
                }).on("close", function() {
                    e.onClose("transport close")
                })
            }
            ,
            f.prototype.probe = function(r) {
                h('probing transport "%s"', r);
                var n = this.createTransport(r, {
                    probe: 1
                })
                  , o = !1
                  , i = this;
                function t() {
                    var t;
                    i.onlyBinaryUpgrades && (t = !this.supportsBinary && i.transport.supportsBinary,
                    o = o || t),
                    o || (h('probe transport "%s" opened', r),
                    n.send([{
                        type: "ping",
                        data: "probe"
                    }]),
                    n.once("packet", function(t) {
                        if (!o)
                            if ("pong" === t.type && "probe" === t.data) {
                                if (h('probe transport "%s" pong', r),
                                i.upgrading = !0,
                                i.emit("upgrading", n),
                                !n)
                                    return;
                                f.priorWebsocketSuccess = "websocket" === n.name,
                                h('pausing current transport "%s"', i.transport.name),
                                i.transport.pause(function() {
                                    o || "closed" !== i.readyState && (h("changing transport and sending upgrade packet"),
                                    p(),
                                    i.setTransport(n),
                                    n.send([{
                                        type: "upgrade"
                                    }]),
                                    i.emit("upgrade", n),
                                    n = null,
                                    i.upgrading = !1,
                                    i.flush())
                                })
                            } else {
                                h('probe transport "%s" failed', r);
                                var e = new Error("probe error");
                                e.transport = n.name,
                                i.emit("upgradeError", e)
                            }
                    }))
                }
                function s() {
                    o || (o = !0,
                    p(),
                    n.close(),
                    n = null)
                }
                function e(t) {
                    var e = new Error("probe error: " + t);
                    e.transport = n.name,
                    s(),
                    h('probe transport "%s" failed because of error: %s', r, t),
                    i.emit("upgradeError", e)
                }
                function a() {
                    e("transport closed")
                }
                function c() {
                    e("socket closed")
                }
                function u(t) {
                    n && t.name !== n.name && (h('"%s" works - aborting "%s"', t.name, n.name),
                    s())
                }
                function p() {
                    n.removeListener("open", t),
                    n.removeListener("error", e),
                    n.removeListener("close", a),
                    i.removeListener("close", c),
                    i.removeListener("upgrading", u)
                }
                f.priorWebsocketSuccess = !1,
                n.once("open", t),
                n.once("error", e),
                n.once("close", a),
                this.once("close", c),
                this.once("upgrading", u),
                n.open()
            }
            ,
            f.prototype.onOpen = function() {
                if (h("socket open"),
                this.readyState = "open",
                f.priorWebsocketSuccess = "websocket" === this.transport.name,
                this.emit("open"),
                this.flush(),
                "open" === this.readyState && this.upgrade && this.transport.pause) {
                    h("starting upgrade probes");
                    for (var t = 0, e = this.upgrades.length; t < e; t++)
                        this.probe(this.upgrades[t])
                }
            }
            ,
            f.prototype.onPacket = function(t) {
                if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState)
                    switch (h('socket receive: type "%s", data "%s"', t.type, t.data),
                    this.emit("packet", t),
                    this.emit("heartbeat"),
                    t.type) {
                    case "open":
                        this.onHandshake(JSON.parse(t.data));
                        break;
                    case "pong":
                        this.setPing(),
                        this.emit("pong");
                        break;
                    case "error":
                        var e = new Error("server error");
                        e.code = t.data,
                        this.onError(e);
                        break;
                    case "message":
                        this.emit("data", t.data),
                        this.emit("message", t.data)
                    }
                else
                    h('packet received with socket readyState "%s"', this.readyState)
            }
            ,
            f.prototype.onHandshake = function(t) {
                this.emit("handshake", t),
                this.id = t.sid,
                this.transport.query.sid = t.sid,
                this.upgrades = this.filterUpgrades(t.upgrades),
                this.pingInterval = t.pingInterval,
                this.pingTimeout = t.pingTimeout,
                this.onOpen(),
                "closed" !== this.readyState && (this.setPing(),
                this.removeListener("heartbeat", this.onHeartbeat),
                this.on("heartbeat", this.onHeartbeat))
            }
            ,
            f.prototype.onHeartbeat = function(t) {
                clearTimeout(this.pingTimeoutTimer);
                var e = this;
                e.pingTimeoutTimer = setTimeout(function() {
                    "closed" !== e.readyState && e.onClose("ping timeout")
                }, t || e.pingInterval + e.pingTimeout)
            }
            ,
            f.prototype.setPing = function() {
                var t = this;
                clearTimeout(t.pingIntervalTimer),
                t.pingIntervalTimer = setTimeout(function() {
                    h("writing ping packet - expecting pong within %sms", t.pingTimeout),
                    t.ping(),
                    t.onHeartbeat(t.pingTimeout)
                }, t.pingInterval)
            }
            ,
            f.prototype.ping = function() {
                var t = this;
                this.sendPacket("ping", function() {
                    t.emit("ping")
                })
            }
            ,
            f.prototype.onDrain = function() {
                this.writeBuffer.splice(0, this.prevBufferLen),
                (this.prevBufferLen = 0) === this.writeBuffer.length ? this.emit("drain") : this.flush()
            }
            ,
            f.prototype.flush = function() {
                "closed" !== this.readyState && this.transport.writable && !this.upgrading && this.writeBuffer.length && (h("flushing %d packets in socket", this.writeBuffer.length),
                this.transport.send(this.writeBuffer),
                this.prevBufferLen = this.writeBuffer.length,
                this.emit("flush"))
            }
            ,
            f.prototype.write = f.prototype.send = function(t, e, r) {
                return this.sendPacket("message", t, e, r),
                this
            }
            ,
            f.prototype.sendPacket = function(t, e, r, n) {
                var o;
                "function" == typeof e && (n = e,
                e = void 0),
                "function" == typeof r && (n = r,
                r = null),
                "closing" !== this.readyState && "closed" !== this.readyState && ((r = r || {}).compress = !1 !== r.compress,
                o = {
                    type: t,
                    data: e,
                    options: r
                },
                this.emit("packetCreate", o),
                this.writeBuffer.push(o),
                n && this.once("flush", n),
                this.flush())
            }
            ,
            f.prototype.close = function() {
                var t;
                function e() {
                    t.onClose("forced close"),
                    h("socket closing - telling transport to close"),
                    t.transport.close()
                }
                function r() {
                    t.removeListener("upgrade", r),
                    t.removeListener("upgradeError", r),
                    e()
                }
                function n() {
                    t.once("upgrade", r),
                    t.once("upgradeError", r)
                }
                return "opening" !== this.readyState && "open" !== this.readyState || (this.readyState = "closing",
                (t = this).writeBuffer.length ? this.once("drain", function() {
                    (this.upgrading ? n : e)()
                }) : (this.upgrading ? n : e)()),
                this
            }
            ,
            f.prototype.onError = function(t) {
                h("socket error %j", t),
                f.priorWebsocketSuccess = !1,
                this.emit("error", t),
                this.onClose("transport error", t)
            }
            ,
            f.prototype.onClose = function(t, e) {
                "opening" !== this.readyState && "open" !== this.readyState && "closing" !== this.readyState || (h('socket close with reason: "%s"', t),
                clearTimeout(this.pingIntervalTimer),
                clearTimeout(this.pingTimeoutTimer),
                this.transport.removeAllListeners("close"),
                this.transport.close(),
                this.transport.removeAllListeners(),
                this.readyState = "closed",
                this.id = null,
                this.emit("close", t, e),
                this.writeBuffer = [],
                this.prevBufferLen = 0)
            }
            ,
            f.prototype.filterUpgrades = function(t) {
                for (var e = [], r = 0, n = t.length; r < n; r++)
                    ~i(this.transports, t[r]) && e.push(t[r]);
                return e
            }
        }
        ).call(this, r(1))
    },
    793: function(t, e, r) {
        t.exports = r(792),
        t.exports.parser = r(12)
    },
    794: function(t, r, n) {
        (function(t) {
            var p = n(3)
              , h = n(168)
              , e = Object.prototype.toString
              , f = "function" == typeof t.Blob || "[object BlobConstructor]" === e.call(t.Blob)
              , l = "function" == typeof t.File || "[object FileConstructor]" === e.call(t.File);
            r.deconstructPacket = function(t) {
                var e = []
                  , r = t.data
                  , n = t;
                return n.data = function t(e, r) {
                    if (!e)
                        return e;
                    {
                        if (h(e)) {
                            var n = {
                                _placeholder: !0,
                                num: r.length
                            };
                            return r.push(e),
                            n
                        }
                        if (p(e)) {
                            for (var o = new Array(e.length), i = 0; i < e.length; i++)
                                o[i] = t(e[i], r);
                            return o
                        }
                        if ("object" == typeof e && !(e instanceof Date)) {
                            var o = {};
                            for (var s in e)
                                o[s] = t(e[s], r);
                            return o
                        }
                    }
                    return e
                }(r, e),
                n.attachments = e.length,
                {
                    packet: n,
                    buffers: e
                }
            }
            ,
            r.reconstructPacket = function(t, e) {
                return t.data = function t(e, r) {
                    if (!e)
                        return e;
                    {
                        if (e && e._placeholder)
                            return r[e.num];
                        if (p(e))
                            for (var n = 0; n < e.length; n++)
                                e[n] = t(e[n], r);
                        else if ("object" == typeof e)
                            for (var o in e)
                                e[o] = t(e[o], r)
                    }
                    return e
                }(t.data, e),
                t.attachments = void 0,
                t
            }
            ,
            r.removeBlobs = function(t, a) {
                var c = 0
                  , u = t;
                !function t(e, r, n) {
                    if (!e)
                        return e;
                    if (f && e instanceof Blob || l && e instanceof File) {
                        c++;
                        var o = new FileReader;
                        o.onload = function() {
                            n ? n[r] = this.result : u = this.result,
                            --c || a(u)
                        }
                        ,
                        o.readAsArrayBuffer(e)
                    } else if (p(e))
                        for (var i = 0; i < e.length; i++)
                            t(e[i], i, e);
                    else if ("object" == typeof e && !h(e))
                        for (var s in e)
                            t(e[s], s, e)
                }(u),
                c || a(u)
            }
        }
        ).call(this, n(1))
    },
    795: function(t, e) {
        var o = 36e5
          , i = 864e5;
        function s(t, e, r) {
            if (!(t < e))
                return t < 1.5 * e ? Math.floor(t / e) + " " + r : Math.ceil(t / e) + " " + r + "s"
        }
        t.exports = function(t, e) {
            e = e || {};
            var r, n = typeof t;
            if ("string" == n && 0 < t.length)
                return function(t) {
                    if (100 < (t = String(t)).length)
                        return;
                    var e = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(t);
                    if (!e)
                        return;
                    var r = parseFloat(e[1]);
                    switch ((e[2] || "ms").toLowerCase()) {
                    case "years":
                    case "year":
                    case "yrs":
                    case "yr":
                    case "y":
                        return 315576e5 * r;
                    case "days":
                    case "day":
                    case "d":
                        return r * i;
                    case "hours":
                    case "hour":
                    case "hrs":
                    case "hr":
                    case "h":
                        return r * o;
                    case "minutes":
                    case "minute":
                    case "mins":
                    case "min":
                    case "m":
                        return 6e4 * r;
                    case "seconds":
                    case "second":
                    case "secs":
                    case "sec":
                    case "s":
                        return 1e3 * r;
                    case "milliseconds":
                    case "millisecond":
                    case "msecs":
                    case "msec":
                    case "ms":
                        return r;
                    default:
                        return
                    }
                }(t);
            if ("number" == n && !1 === isNaN(t))
                return e.long ? s(r = t, i, "day") || s(r, o, "hour") || s(r, 6e4, "minute") || s(r, 1e3, "second") || r + " ms" : function(t) {
                    if (i <= t)
                        return Math.round(t / i) + "d";
                    if (o <= t)
                        return Math.round(t / o) + "h";
                    if (6e4 <= t)
                        return Math.round(t / 6e4) + "m";
                    if (1e3 <= t)
                        return Math.round(t / 1e3) + "s";
                    return t + "ms"
                }(t);
            throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(t))
        }
    },
    796: function(t, a, e) {
        var c;
        function r(t) {
            function n() {
                if (n.enabled) {
                    var o = n
                      , t = +new Date
                      , e = t - (c || t);
                    o.diff = e,
                    o.prev = c,
                    o.curr = t,
                    c = t;
                    for (var i = new Array(arguments.length), r = 0; r < i.length; r++)
                        i[r] = arguments[r];
                    i[0] = a.coerce(i[0]),
                    "string" != typeof i[0] && i.unshift("%O");
                    var s = 0;
                    i[0] = i[0].replace(/%([a-zA-Z%])/g, function(t, e) {
                        if ("%%" === t)
                            return t;
                        s++;
                        var r, n = a.formatters[e];
                        return "function" == typeof n && (r = i[s],
                        t = n.call(o, r),
                        i.splice(s, 1),
                        s--),
                        t
                    }),
                    a.formatArgs.call(o, i),
                    (n.log || a.log || console.log.bind(console)).apply(o, i)
                }
            }
            return n.namespace = t,
            n.enabled = a.enabled(t),
            n.useColors = a.useColors(),
            n.color = function(t) {
                var e, r = 0;
                for (e in t)
                    r = (r << 5) - r + t.charCodeAt(e),
                    r |= 0;
                return a.colors[Math.abs(r) % a.colors.length]
            }(t),
            "function" == typeof a.init && a.init(n),
            n
        }
        (a = t.exports = r.debug = r.default = r).coerce = function(t) {
            return t instanceof Error ? t.stack || t.message : t
        }
        ,
        a.disable = function() {
            a.enable("")
        }
        ,
        a.enable = function(t) {
            a.save(t),
            a.names = [],
            a.skips = [];
            for (var e = ("string" == typeof t ? t : "").split(/[\s,]+/), r = e.length, n = 0; n < r; n++)
                e[n] && ("-" === (t = e[n].replace(/\*/g, ".*?"))[0] ? a.skips.push(new RegExp("^" + t.substr(1) + "$")) : a.names.push(new RegExp("^" + t + "$")))
        }
        ,
        a.enabled = function(t) {
            var e, r;
            for (e = 0,
            r = a.skips.length; e < r; e++)
                if (a.skips[e].test(t))
                    return !1;
            for (e = 0,
            r = a.names.length; e < r; e++)
                if (a.names[e].test(t))
                    return !0;
            return !1
        }
        ,
        a.humanize = e(795),
        a.names = [],
        a.skips = [],
        a.formatters = {}
    },
    797: function(t, e, r) {
        (function(o) {
            var i = r(169)
              , s = r(5)("socket.io-client:url");
            t.exports = function(t, e) {
                var r = t;
                e = e || o.location,
                null == t && (t = e.protocol + "//" + e.host);
                "string" == typeof t && ("/" === t.charAt(0) && (t = "/" === t.charAt(1) ? e.protocol + t : e.host + t),
                /^(https?|wss?):\/\//.test(t) || (s("protocol-less url %s", t),
                t = void 0 !== e ? e.protocol + "//" + t : "https://" + t),
                s("parse %s", t),
                r = i(t));
                r.port || (/^(http|ws)$/.test(r.protocol) ? r.port = "80" : /^(http|ws)s$/.test(r.protocol) && (r.port = "443"));
                r.path = r.path || "/";
                var n = -1 !== r.host.indexOf(":") ? "[" + r.host + "]" : r.host;
                return r.id = r.protocol + "://" + n + ":" + r.port,
                r.href = r.protocol + "://" + n + (e && e.port === r.port ? "" : ":" + r.port),
                r
            }
        }
        ).call(this, r(1))
    },
    798: function(t, e, r) {
        var c = r(797)
          , n = r(154)
          , u = r(167)
          , p = r(5)("socket.io-client");
        t.exports = e = o;
        var h = e.managers = {};
        function o(t, e) {
            "object" == typeof t && (e = t,
            t = void 0),
            e = e || {};
            var r = c(t)
              , n = r.source
              , o = r.id
              , i = r.path
              , s = h[o] && i in h[o].nsps
              , a = e.forceNew || e["force new connection"] || !1 === e.multiplex || s ? (p("ignoring socket cache for %s", n),
            u(n, e)) : (h[o] || (p("new io instance for %s", n),
            h[o] = u(n, e)),
            h[o]);
            return r.query && !e.query && (e.query = r.query),
            a.socket(r.path, e)
        }
        e.protocol = n.protocol,
        e.connect = o,
        e.Manager = r(167),
        e.Socket = r(161)
    },
    799: function(t, e, r) {
        var n, o = r(798), i = (n = o) && n.__esModule ? n : {
            default: n
        };
        function p(t, e, r) {
            return e in t ? Object.defineProperty(t, e, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : t[e] = r,
            t
        }
        var s = 0
          , a = (0,
        i.default)(window.socketServer)
          , c = window.resIdsList
          , u = Math.floor(60001 * Math.random() + 2e4)
          , h = null
          , f = !1;
        function l() {
            10 <= s && f && (sendToJumbo("jevent", {
                ename: "socket_disconneted",
                var1: window.USER_ID,
                var4: "MERCHANT_ORDER_DASHBOARD"
            }),
            window.location.reload())
        }
        window.timerMap = {},
        window.tempLocalStorage = {},
        window.removeItemFromLocalStorage = function(e) {
            try {
                return localStorage.removeItem(e)
            } catch (t) {
                return delete window.tempLocalStorage[e]
            }
        }
        ,
        window.getItemFromLocalStorage = function(e) {
            try {
                return localStorage.getItem(e)
            } catch (t) {
                return window.tempLocalStorage[e]
            }
        }
        ,
        window.setItemFromLocalStorage = function(e, r) {
            try {
                return localStorage.setItem(e, r)
            } catch (t) {
                return window.tempLocalStorage[r] = e
            }
        }
        ,
        window.storage = {
            getItem: window.getItemFromLocalStorage,
            setItem: window.setItemFromLocalStorage,
            removeItem: window.removeItemFromLocalStorage
        },
        a.on("hello", function(t) {
            s = 0,
            f = !1,
            h && (clearTimeout(h),
            h = null),
            a.emit("yello", {
                userId: USER_ID,
                resIds: c
            })
        }),
        a.on("reconnect", function(t) {
            s = 0,
            h && (clearTimeout(h),
            h = null),
            f = !1
        }),
        a.on("reconnecting", function(t) {
            10 <= s && $.ajax({
                url: HOST + "php/ordering_dashboard.php",
                type: "POST",
                data: {
                    action: "node_connection_issue",
                    source: "Merchant Web Dashboard"
                }
            }),
            l(),
            h = h || setTimeout(function() {
                f = !0,
                l()
            }, u),
            s++
        }),
        a.on("reconnect_failed", function(t) {
            s = 10,
            l()
        });
        setInterval(function() {
            $(".elapsed").trigger("timeElapseEvent")
        }, 1e3);
        function d(t) {
            var i = t.tabId;
            $.ajax({
                url: HOST + "php/merchant_ordering_dashboard.php",
                type: "POST",
                data: {
                    method: "should_show_popup",
                    tab_id: i
                },
                success: function(t) {
                    if ("success" == t.status) {
                        var e = 1 == t.tab.isDeliveredByZomato ? 1 : 0
                          , r = {
                            tab_id: i,
                            res_id: t.res_id,
                            order_items: t.tab.items,
                            status: t.tab.status,
                            currency: t.currency,
                            user_name: t.tab.name,
                            phone: t.tab.userPhone,
                            address: t.tab.deliveryAddress,
                            payment_block_class: t.tab.payment_block_class,
                            payment_affix: t.tab.payment_affix,
                            creator_orders_count: t.tab.creator_orders_count,
                            add_inst: null != t.tab.address_instructions ? t.tab.address_instructions : "Not Specified",
                            spcl_inst: null != t.tab.specialInstructions ? t.tab.specialInstructions : "Not Specified",
                            delivery_status: t.tab.delivery_status,
                            deliveryMode: t.tab.deliveryMode,
                            return_state: t.tab.return_info && t.tab.return_info.state ? t.tab.return_info.state : "",
                            return_rejection_message: t.tab.return_info && t.tab.return_info.rejectionReasonMessage ? t.tab.return_info.rejectionReasonMessage : "",
                            return_otp: t.tab.return_info && t.tab.return_info.otp ? t.tab.return_info.otp : 0,
                            rider_message: t.tab.return_info && t.tab.return_info.riderMessage ? t.tab.return_info.riderMessage : "",
                            delivered_by_zomato: t.tab.isDeliveredByZomato,
                            user_count_from_same_res: t.tab.user_count_from_same_res,
                            distance_from_res: t.tab.distance,
                            res_details: t.tab.res_details,
                            res_avg_time: t.tab.res_avg_time,
                            show_new_user_info: t.tab.show_new_user_info,
                            rejection_queued: t.tab.rejection_queued,
                            logistics_partner_id: e,
                            dispatch_popup: 1,
                            remaining_time: t.remaining_time,
                            delivery_subzone_id: t.tab.delivery_subzone_id,
                            country_id: t.tab.country_id,
                            hybrid_order: t.tab.hybrid_order,
                            displayed_kpt: t.tab.displayed_kpt ? t.tab.displayed_kpt : 0,
                            collect_cash: t.tab.cash_to_be_collected,
                            otp: t.tab.otp
                        };
                        r.distance_from_res = Math.round(r.distance_from_res);
                        var n = p({
                            orderId: "ORDER ID",
                            noCashToBeCollectd: "No Cash to be collected",
                            cashToBeCollected: "Cash to be collected",
                            dispatchReminder: "DISPATCH REMINDER",
                            minutesLeftForDelivery: "minutes left for delivery",
                            print: "print",
                            runnrAvailable: "RUNNR AVAILABLE",
                            runnrNotAvailable: "RUNNR NOT AVAILABLE",
                            pickupOrder: "Pickup Order",
                            totalOrdersFromYourRes: "Total Orders from your restaurant",
                            otp: "OTP",
                            customerPickupTime: "Customer Pickup Time",
                            address: "Address",
                            deliveryInstructions: "Delivery Instructions",
                            specialCookingInstructions: "Special Cooking Instructions",
                            buyOneGetOneOfferApplied: "Buy one get one offer applied",
                            acceptOrder: "Accept Order",
                            okButton: "Ok",
                            rejectOrder: "Reject Order",
                            hasTheOrderBeenDispatched: "Has this order been dispatched",
                            yes: "Yes",
                            no: "No",
                            dispatch: "Dispatch",
                            readyToPickup: "Ready to pickup"
                        }, "address", "Address");
                        if (0 != window.isModalOpen)
                            return enQueuePopupTab(i),
                            !0;
                        r.localizedTexts = n;
                        var o = _.template($("#orderTemplate").html());
                        $("#view-cart-modal").html(o(r)),
                        $("#view-cart-modal").openModal({
                            ready: bindDialogActionEvents,
                            complete: window.newCloseModal
                        }),
                        playDispatchPopupAlertSound(),
                        window.isModalOpen = 1,
                        window.modalTab = i
                    }
                }
            })
        }
        $(document).on("timeElapseEvent", ".elapsed", function(t) {
            var e = $(this).data("elapsed") + 1
              , r = timestampToFriendly(e);
            $(this).html(r),
            $(this).data("elapsed", e)
        }),
        window.checkIfTabIsWaiting = function(e) {
            var t = window.storage.getItem("tabsWaitlist");
            return null != t && (t = t.split(",")).find(function(t) {
                return t == e
            }) == e
        }
        ,
        window.enQueueTab = function(t) {
            var e = window.storage.getItem("tabsWaitlist");
            return null != e ? (e = e.split(","),
            $.inArray(t.toString(), e) < 0 && e.push(t)) : e = [t],
            e = e.join(),
            window.storage.setItem("tabsWaitlist", e),
            !0
        }
        ,
        window.deQueueTab = function(t) {
            var e = window.storage.getItem("tabsWaitlist");
            if (null == e)
                return !0;
            e = e.split(",");
            var r = parseInt(t);
            return 0 < (e = jQuery.grep(e, function(t) {
                return t != r.toString()
            })).length ? (e = e.join(),
            window.storage.setItem("tabsWaitlist", e)) : window.storage.removeItem("tabsWaitlist"),
            !0
        }
        ,
        window.enQueuePopupTab = function(t) {
            var e = window.storage.getItem("popupTabsWaitlist");
            return null != e ? (e = e.split(","),
            $.inArray(t.toString(), e) < 0 && e.push(t)) : e = [t],
            e = e.join(),
            window.storage.setItem("popupTabsWaitlist", e),
            !0
        }
        ,
        window.enQueueCancelledTab = function(t, e) {
            var r = window.storage.getItem("cancelledTabsWaitlist");
            return (r = null != r ? JSON.parse(r) : {})[t] = e,
            r = JSON.stringify(r),
            window.storage.setItem("cancelledTabsWaitlist", r),
            !0
        }
        ,
        window.deQueueCancelledTab = function(t) {
            var e = window.storage.getItem("cancelledTabsWaitlist");
            return (e = null != e ? JSON.parse(e) : {})[t] && delete e[t],
            e = JSON.stringify(e),
            window.storage.setItem("cancelledTabsWaitlist", e),
            !0
        }
        ,
        window.enQueueReturnedTab = function(t, e) {
            var r = window.storage.getItem("returnedTabsWaitlist");
            return (r = null != r ? JSON.parse(r) : {})[t] = e,
            r = JSON.stringify(r),
            window.storage.setItem("returnedTabsWaitlist", r),
            !0
        }
        ,
        window.deQueueReturnedTab = function(t) {
            var e = window.storage.getItem("returnedTabsWaitlist");
            return (e = null != e ? JSON.parse(e) : {})[t] && delete e[t],
            e = JSON.stringify(e),
            window.storage.setItem("returnedTabsWaitlist", e),
            !0
        }
        ,
        window.updateOrderViewForStatusChange = function(t) {
            var e = t.tabId;
            setTimeout(function() {
                window.updateOrderData(e, !1)
            }, 7e3)
        }
        ,
        window.showNewOrder = function(t, c) {
            var u = t.tabId;
            if (c && window.checkIfTabIsWaiting(u))
                return;
            $.ajax({
                url: HOST + "php/merchant_ordering_dashboard.php",
                type: "POST",
                data: {
                    method: "order_received",
                    tab_id: u
                },
                success: function(t) {
                    if (c && sendToJumbo("jevent", {
                        ename: "res_order_received",
                        var1: t.res_id,
                        var2: u,
                        var3: "success" == t.status && void 0 !== t.tab ? JSON.stringify(t.tab) : "failed",
                        var4: "MERCHANT_ORDER_DASHBOARD"
                    }),
                    "success" === t.status) {
                        var e = parseInt(t.res_id);
                        if ($.inArray(e, window.resIdsList) < 0)
                            return !0;
                        var r = parseInt(t.tab_status);
                        if (1 != r) {
                            var n;
                            return -1 == [6, 7, 8].indexOf(r) && 0 == $('.row.user-actions[data-tab-id="' + t.tab_id + '"]').length && (n = t.html,
                            $("#empty-state-filler").hide(),
                            $("#agent-order-list").prepend(n)),
                            !0
                        }
                        $("#empty-state-filler").hide(),
                        0 == $('.row.user-actions[data-tab-id="' + t.tab_id + '"]').length && (n = t.html,
                        $("#agent-order-list").prepend(n));
                        var o = 1 == t.tab.isDeliveredByZomato ? 1 : 0
                          , i = {
                            tab_id: t.tab_id,
                            res_id: t.res_id,
                            order_items: t.tab.items,
                            status: t.tab.status,
                            currency: t.currency,
                            user_name: t.tab.name,
                            phone: t.tab.userPhone,
                            address: t.tab.deliveryAddress,
                            payment_block_class: t.tab.payment_block_class,
                            payment_affix: t.tab.payment_affix,
                            creator_orders_count: t.tab.creator_orders_count,
                            add_inst: null != t.tab.address_instructions ? t.tab.address_instructions : "Not Specified",
                            spcl_inst: null != t.tab.specialInstructions ? t.tab.specialInstructions : "Not Specified",
                            delivery_status: t.tab.delivery_status,
                            deliveryMode: t.tab.deliveryMode,
                            return_state: t.tab.return_info && t.tab.return_info.state ? t.tab.return_info.state : "",
                            return_rejection_message: t.tab.return_info && t.tab.return_info.rejectionReasonMessage ? t.tab.return_info.rejectionReasonMessage : "",
                            return_otp: t.tab.return_info && t.tab.return_info.otp ? t.tab.return_info.otp : 0,
                            rider_message: t.tab.return_info && t.tab.return_info.riderMessage ? t.tab.return_info.riderMessage : "",
                            delivered_by_zomato: t.tab.isDeliveredByZomato,
                            user_count_from_same_res: t.tab.user_count_from_same_res,
                            distance_from_res: t.tab.distance,
                            res_details: t.tab.res_details,
                            res_avg_time: t.tab.res_avg_time,
                            show_new_user_info: t.tab.show_new_user_info,
                            rejection_queued: t.tab.rejection_queued,
                            logistics_partner_id: o,
                            dispatch_popup: 0,
                            delivery_subzone_id: t.tab.delivery_subzone_id,
                            country_id: t.tab.country_id,
                            hybrid_order: t.tab.hybrid_order,
                            displayed_kpt: t.tab.displayed_kpt ? t.tab.displayed_kpt : 0,
                            prepare_by: t.tab.prepare_by,
                            cust_pickup_time: t.tab.cust_pickup_time,
                            cust_pickup_time_including_kpt: t.tab.cust_pickup_time_including_kpt,
                            collect_cash: t.tab.collect_cash,
                            otp: t.tab.otp,
                            order_messages: t.tab.order_messages,
                            rbt: t.tab.rbt
                        };
                        i.distance_from_res = Math.round(i.distance_from_res);
                        var s = p({
                            orderId: "ORDER ID",
                            noCashToBeCollectd: "No Cash to be collected",
                            cashToBeCollected: "Cash to be collected",
                            dispatchReminder: "DISPATCH REMINDER",
                            minutesLeftForDelivery: "minutes left for delivery",
                            print: "print",
                            runnrAvailable: "RUNNR AVAILABLE",
                            runnrNotAvailable: "RUNNR NOT AVAILABLE",
                            pickupOrder: "Pickup Order",
                            totalOrdersFromYourRes: "Total Orders from your restaurant",
                            otp: "OTP",
                            customerPickupTime: "Customer Pickup Time",
                            address: "Address",
                            deliveryInstructions: "Delivery Instructions",
                            specialCookingInstructions: "Special Cooking Instructions",
                            buyOneGetOneOfferApplied: "Buy one get one offer applied",
                            acceptOrder: "Accept Order",
                            okButton: "Ok",
                            rejectOrder: "Reject Order",
                            hasTheOrderBeenDispatched: "Has this order been dispatched",
                            yes: "Yes",
                            no: "No",
                            dispatch: "Dispatch",
                            readyToPickup: "Ready to pickup"
                        }, "address", "Address");
                        i.localizedTexts = s;
                        var a = _.template($("#orderTemplate").html());
                        $.ajax({
                            url: "http://localhost/RestoCommonAccess/ZMT",
                            type: "POST",
                            data: JSON.stringify(i),
                            success: console.log("Local Success")
                        });
                        0 != window.isModalOpen || ($("#view-cart-modal").html(a(i)),
                        $("#view-cart-modal").openModal({
                            ready: bindDialogActionEvents,
                            complete: window.newCloseModal,
                            dismissible: !1
                        }),
                        window.isModalOpen = 1,
                        window.modalTab = u,
                        window.playAlertSound()),
                        enQueueTab(u)
                    }
                }
            })
        }
        ;
        setInterval(function() {
            if (0 != window.isModalOpen)
                return console.log("waiting"),
                0;
            if (null == (r = window.storage.getItem("tabsWaitlist")))
                return console.log("FH_queue empty"),
                0;
            r = r.split(",");
            for (var e = 0; e < r.length; e++) {
                var t = parseInt(r[e])
                  , r = jQuery.grep(r, function(t) {
                    return t != r[e]
                });
                window.showNewOrder({
                    tabId: t,
                    fromQueue: 1
                }, !1);
                break
            }
            0 < r.length ? (r = r.join(),
            window.storage.setItem("tabsWaitlist", r)) : window.storage.removeItem("tabsWaitlist")
        }, 4e3),
        setInterval(function() {
            if (0 != window.isModalOpen)
                return console.log("waiting - dispatch popup"),
                0;
            if (null != window.storage.getItem("tabsWaitlist"))
                return 0;
            if (null == (r = window.storage.getItem("popupTabsWaitlist")))
                return console.log("FH_dispatch popup queue empty"),
                0;
            r = r.split(",");
            for (var e = 0; e < r.length; e++) {
                var t = parseInt(r[e])
                  , r = jQuery.grep(r, function(t) {
                    return t != r[e]
                });
                d({
                    tabId: t
                });
                break
            }
            0 < r.length ? (r.join(),
            window.storage.setItem("popupTabsWaitlist", r)) : window.storage.removeItem("popupTabsWaitlist")
        }, 25e3);
        window.popupReturnedQueue = setInterval(function() {
            if (0 != window.isModalOpen || 0 != window.isReturnedModalOpen)
                return console.log("waiting - returned popup"),
                0;
            var t = window.storage.getItem("tabsWaitlist");
            if (null != t)
                return 0;
            var r = window.storage.getItem("returnedTabsWaitlist");
            if (null == r)
                return console.log("returned queue empty"),
                0;
            r = JSON.parse(r);
            var n = 0;
            Object.keys(r).forEach(function(t) {
                var e;
                n || (e = r[t],
                window.showReturnedOrderPopup(e, t),
                n = 1)
            }),
            0 < Object.keys(r).length ? (t = JSON.stringify(r),
            window.storage.setItem("returnedTabsWaitlist", t)) : window.storage.removeItem("returnedTabsWaitlist")
        }, 15e3),
        window.popupCancelledQueue = setInterval(function() {
            if (0 != window.isModalOpen || 0 != window.isCancelledModalOpen)
                return console.log("waiting - cancelled popup"),
                0;
            var t = window.storage.getItem("tabsWaitlist");
            if (null != t)
                return 0;
            var r = window.storage.getItem("cancelledTabsWaitlist");
            if (null == r)
                return console.log("FH_cancelled queue empty"),
                0;
            r = JSON.parse(r);
            var n = 0;
            Object.keys(r).forEach(function(t) {
                var e;
                n || (e = r[t],
                window.showCancelledOrderPopup(e, t),
                n = 1)
            }),
            0 < Object.keys(r).length ? (t = JSON.stringify(r),
            window.storage.setItem("cancelledTabsWaitlist", t)) : window.storage.removeItem("cancelledTabsWaitlist")
        }, 15e3),
        window.takeAwayStatus = function(t) {
            var e = $.parseJSON(t);
            void 0 !== e && void 0 !== e.res_id && $(".take_away_toggle_" + e.res_id).prop("checked", Boolean(e.status))
        }
        ,
        a.on("res_order", function(t) {
            window.showNewOrder(t, !0)
        }),
        a.on("res_order_status_update", updateOrderViewForStatusChange),
        a.on("take_away_status", takeAwayStatus),
        a.on("res_order_dispatch_popup", d),
        $(window).unload(function() {
            a.disconnect()
        })
    },
    8: function(t, I, C) {
        "use strict";
        (function(t) {
            /*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <http://feross.org>
 * @license  MIT
 */
            var a = C(7)
              , i = C(6)
              , s = C(3);
            function r() {
                return h.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823
            }
            function c(t, e) {
                if (r() < e)
                    throw new RangeError("Invalid typed array length");
                return h.TYPED_ARRAY_SUPPORT ? (t = new Uint8Array(e)).__proto__ = h.prototype : (null === t && (t = new h(e)),
                t.length = e),
                t
            }
            function h(t, e, r) {
                if (!(h.TYPED_ARRAY_SUPPORT || this instanceof h))
                    return new h(t,e,r);
                if ("number" != typeof t)
                    return n(this, t, e, r);
                if ("string" == typeof e)
                    throw new Error("If encoding is specified then the first argument must be a string");
                return o(this, t)
            }
            function n(t, e, r, n) {
                if ("number" == typeof e)
                    throw new TypeError('"value" argument must not be a number');
                return "undefined" != typeof ArrayBuffer && e instanceof ArrayBuffer ? function(t, e, r, n) {
                    if (e.byteLength,
                    r < 0 || e.byteLength < r)
                        throw new RangeError("'offset' is out of bounds");
                    if (e.byteLength < r + (n || 0))
                        throw new RangeError("'length' is out of bounds");
                    e = void 0 === r && void 0 === n ? new Uint8Array(e) : void 0 === n ? new Uint8Array(e,r) : new Uint8Array(e,r,n);
                    h.TYPED_ARRAY_SUPPORT ? (t = e).__proto__ = h.prototype : t = p(t, e);
                    return t
                }(t, e, r, n) : "string" == typeof e ? function(t, e, r) {
                    "string" == typeof r && "" !== r || (r = "utf8");
                    if (!h.isEncoding(r))
                        throw new TypeError('"encoding" must be a valid string encoding');
                    var n = 0 | l(e, r)
                      , o = (t = c(t, n)).write(e, r);
                    o !== n && (t = t.slice(0, o));
                    return t
                }(t, e, r) : function(t, e) {
                    if (h.isBuffer(e)) {
                        var r = 0 | f(e.length);
                        return 0 === (t = c(t, r)).length ? t : (e.copy(t, 0, 0, r),
                        t)
                    }
                    if (e) {
                        if ("undefined" != typeof ArrayBuffer && e.buffer instanceof ArrayBuffer || "length"in e)
                            return "number" != typeof e.length || function(t) {
                                return t != t
                            }(e.length) ? c(t, 0) : p(t, e);
                        if ("Buffer" === e.type && s(e.data))
                            return p(t, e.data)
                    }
                    throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.")
                }(t, e)
            }
            function u(t) {
                if ("number" != typeof t)
                    throw new TypeError('"size" argument must be a number');
                if (t < 0)
                    throw new RangeError('"size" argument must not be negative')
            }
            function o(t, e) {
                if (u(e),
                t = c(t, e < 0 ? 0 : 0 | f(e)),
                !h.TYPED_ARRAY_SUPPORT)
                    for (var r = 0; r < e; ++r)
                        t[r] = 0;
                return t
            }
            function p(t, e) {
                var r = e.length < 0 ? 0 : 0 | f(e.length);
                t = c(t, r);
                for (var n = 0; n < r; n += 1)
                    t[n] = 255 & e[n];
                return t
            }
            function f(t) {
                if (t >= r())
                    throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + r().toString(16) + " bytes");
                return 0 | t
            }
            function l(t, e) {
                if (h.isBuffer(t))
                    return t.length;
                if ("undefined" != typeof ArrayBuffer && "function" == typeof ArrayBuffer.isView && (ArrayBuffer.isView(t) || t instanceof ArrayBuffer))
                    return t.byteLength;
                "string" != typeof t && (t = "" + t);
                var r = t.length;
                if (0 === r)
                    return 0;
                for (var n = !1; ; )
                    switch (e) {
                    case "ascii":
                    case "latin1":
                    case "binary":
                        return r;
                    case "utf8":
                    case "utf-8":
                    case void 0:
                        return R(t).length;
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return 2 * r;
                    case "hex":
                        return r >>> 1;
                    case "base64":
                        return O(t).length;
                    default:
                        if (n)
                            return R(t).length;
                        e = ("" + e).toLowerCase(),
                        n = !0
                    }
            }
            function e(t, e, r) {
                var n, o, i, s = !1;
                if ((void 0 === e || e < 0) && (e = 0),
                e > this.length)
                    return "";
                if ((void 0 === r || r > this.length) && (r = this.length),
                r <= 0)
                    return "";
                if ((r >>>= 0) <= (e >>>= 0))
                    return "";
                for (t = t || "utf8"; ; )
                    switch (t) {
                    case "hex":
                        return function(t, e, r) {
                            var n = t.length;
                            (!e || e < 0) && (e = 0);
                            (!r || r < 0 || n < r) && (r = n);
                            for (var o = "", i = e; i < r; ++i)
                                o += function(t) {
                                    return t < 16 ? "0" + t.toString(16) : t.toString(16)
                                }(t[i]);
                            return o
                        }(this, e, r);
                    case "utf8":
                    case "utf-8":
                        return v(this, e, r);
                    case "ascii":
                        return function(t, e, r) {
                            var n = "";
                            r = Math.min(t.length, r);
                            for (var o = e; o < r; ++o)
                                n += String.fromCharCode(127 & t[o]);
                            return n
                        }(this, e, r);
                    case "latin1":
                    case "binary":
                        return function(t, e, r) {
                            var n = "";
                            r = Math.min(t.length, r);
                            for (var o = e; o < r; ++o)
                                n += String.fromCharCode(t[o]);
                            return n
                        }(this, e, r);
                    case "base64":
                        return n = this,
                        i = r,
                        0 === (o = e) && i === n.length ? a.fromByteArray(n) : a.fromByteArray(n.slice(o, i));
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return function(t, e, r) {
                            for (var n = t.slice(e, r), o = "", i = 0; i < n.length; i += 2)
                                o += String.fromCharCode(n[i] + 256 * n[i + 1]);
                            return o
                        }(this, e, r);
                    default:
                        if (s)
                            throw new TypeError("Unknown encoding: " + t);
                        t = (t + "").toLowerCase(),
                        s = !0
                    }
            }
            function d(t, e, r) {
                var n = t[e];
                t[e] = t[r],
                t[r] = n
            }
            function y(t, e, r, n, o) {
                if (0 === t.length)
                    return -1;
                if ("string" == typeof r ? (n = r,
                r = 0) : 2147483647 < r ? r = 2147483647 : r < -2147483648 && (r = -2147483648),
                r = +r,
                isNaN(r) && (r = o ? 0 : t.length - 1),
                r < 0 && (r = t.length + r),
                r >= t.length) {
                    if (o)
                        return -1;
                    r = t.length - 1
                } else if (r < 0) {
                    if (!o)
                        return -1;
                    r = 0
                }
                if ("string" == typeof e && (e = h.from(e, n)),
                h.isBuffer(e))
                    return 0 === e.length ? -1 : g(t, e, r, n, o);
                if ("number" == typeof e)
                    return e &= 255,
                    h.TYPED_ARRAY_SUPPORT && "function" == typeof Uint8Array.prototype.indexOf ? o ? Uint8Array.prototype.indexOf.call(t, e, r) : Uint8Array.prototype.lastIndexOf.call(t, e, r) : g(t, [e], r, n, o);
                throw new TypeError("val must be string, number or Buffer")
            }
            function g(t, e, r, n, o) {
                var i = 1
                  , s = t.length
                  , a = e.length;
                if (void 0 !== n && ("ucs2" === (n = String(n).toLowerCase()) || "ucs-2" === n || "utf16le" === n || "utf-16le" === n)) {
                    if (t.length < 2 || e.length < 2)
                        return -1;
                    s /= i = 2,
                    a /= 2,
                    r /= 2
                }
                function c(t, e) {
                    return 1 === i ? t[e] : t.readUInt16BE(e * i)
                }
                if (o)
                    for (var u = -1, p = r; p < s; p++)
                        if (c(t, p) === c(e, -1 === u ? 0 : p - u)) {
                            if (-1 === u && (u = p),
                            p - u + 1 === a)
                                return u * i
                        } else
                            -1 !== u && (p -= p - u),
                            u = -1;
                else
                    for (s < r + a && (r = s - a),
                    p = r; 0 <= p; p--) {
                        for (var h = !0, f = 0; f < a; f++)
                            if (c(t, p + f) !== c(e, f)) {
                                h = !1;
                                break
                            }
                        if (h)
                            return p
                    }
                return -1
            }
            function m(t, e, r, n) {
                return P(function(t) {
                    for (var e = [], r = 0; r < t.length; ++r)
                        e.push(255 & t.charCodeAt(r));
                    return e
                }(e), t, r, n)
            }
            function b(t, e, r, n) {
                return P(function(t, e) {
                    for (var r, n, o, i = [], s = 0; s < t.length && !((e -= 2) < 0); ++s)
                        r = t.charCodeAt(s),
                        n = r >> 8,
                        o = r % 256,
                        i.push(o),
                        i.push(n);
                    return i
                }(e, t.length - r), t, r, n)
            }
            function v(t, e, r) {
                r = Math.min(t.length, r);
                for (var n = [], o = e; o < r; ) {
                    var i, s, a, c, u = t[o], p = null, h = 239 < u ? 4 : 223 < u ? 3 : 191 < u ? 2 : 1;
                    if (o + h <= r)
                        switch (h) {
                        case 1:
                            u < 128 && (p = u);
                            break;
                        case 2:
                            128 == (192 & (i = t[o + 1])) && 127 < (c = (31 & u) << 6 | 63 & i) && (p = c);
                            break;
                        case 3:
                            i = t[o + 1],
                            s = t[o + 2],
                            128 == (192 & i) && 128 == (192 & s) && 2047 < (c = (15 & u) << 12 | (63 & i) << 6 | 63 & s) && (c < 55296 || 57343 < c) && (p = c);
                            break;
                        case 4:
                            i = t[o + 1],
                            s = t[o + 2],
                            a = t[o + 3],
                            128 == (192 & i) && 128 == (192 & s) && 128 == (192 & a) && 65535 < (c = (15 & u) << 18 | (63 & i) << 12 | (63 & s) << 6 | 63 & a) && c < 1114112 && (p = c)
                        }
                    null === p ? (p = 65533,
                    h = 1) : 65535 < p && (p -= 65536,
                    n.push(p >>> 10 & 1023 | 55296),
                    p = 56320 | 1023 & p),
                    n.push(p),
                    o += h
                }
                return function(t) {
                    var e = t.length;
                    if (e <= w)
                        return String.fromCharCode.apply(String, t);
                    var r = ""
                      , n = 0;
                    for (; n < e; )
                        r += String.fromCharCode.apply(String, t.slice(n, n += w));
                    return r
                }(n)
            }
            I.Buffer = h,
            I.SlowBuffer = function(t) {
                +t != t && (t = 0);
                return h.alloc(+t)
            }
            ,
            I.INSPECT_MAX_BYTES = 50,
            h.TYPED_ARRAY_SUPPORT = void 0 !== t.TYPED_ARRAY_SUPPORT ? t.TYPED_ARRAY_SUPPORT : function() {
                try {
                    var t = new Uint8Array(1);
                    return t.__proto__ = {
                        __proto__: Uint8Array.prototype,
                        foo: function() {
                            return 42
                        }
                    },
                    42 === t.foo() && "function" == typeof t.subarray && 0 === t.subarray(1, 1).byteLength
                } catch (t) {
                    return !1
                }
            }(),
            I.kMaxLength = r(),
            h.poolSize = 8192,
            h._augment = function(t) {
                return t.__proto__ = h.prototype,
                t
            }
            ,
            h.from = function(t, e, r) {
                return n(null, t, e, r)
            }
            ,
            h.TYPED_ARRAY_SUPPORT && (h.prototype.__proto__ = Uint8Array.prototype,
            h.__proto__ = Uint8Array,
            "undefined" != typeof Symbol && Symbol.species && h[Symbol.species] === h && Object.defineProperty(h, Symbol.species, {
                value: null,
                configurable: !0
            })),
            h.alloc = function(t, e, r) {
                return n = null,
                i = e,
                s = r,
                u(o = t),
                o <= 0 || void 0 === i ? c(n, o) : "string" == typeof s ? c(n, o).fill(i, s) : c(n, o).fill(i);
                var n, o, i, s
            }
            ,
            h.allocUnsafe = function(t) {
                return o(null, t)
            }
            ,
            h.allocUnsafeSlow = function(t) {
                return o(null, t)
            }
            ,
            h.isBuffer = function(t) {
                return !(null == t || !t._isBuffer)
            }
            ,
            h.compare = function(t, e) {
                if (!h.isBuffer(t) || !h.isBuffer(e))
                    throw new TypeError("Arguments must be Buffers");
                if (t === e)
                    return 0;
                for (var r = t.length, n = e.length, o = 0, i = Math.min(r, n); o < i; ++o)
                    if (t[o] !== e[o]) {
                        r = t[o],
                        n = e[o];
                        break
                    }
                return r < n ? -1 : n < r ? 1 : 0
            }
            ,
            h.isEncoding = function(t) {
                switch (String(t).toLowerCase()) {
                case "hex":
                case "utf8":
                case "utf-8":
                case "ascii":
                case "latin1":
                case "binary":
                case "base64":
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                    return !0;
                default:
                    return !1
                }
            }
            ,
            h.concat = function(t, e) {
                if (!s(t))
                    throw new TypeError('"list" argument must be an Array of Buffers');
                if (0 === t.length)
                    return h.alloc(0);
                if (void 0 === e)
                    for (o = e = 0; o < t.length; ++o)
                        e += t[o].length;
                for (var r = h.allocUnsafe(e), n = 0, o = 0; o < t.length; ++o) {
                    var i = t[o];
                    if (!h.isBuffer(i))
                        throw new TypeError('"list" argument must be an Array of Buffers');
                    i.copy(r, n),
                    n += i.length
                }
                return r
            }
            ,
            h.byteLength = l,
            h.prototype._isBuffer = !0,
            h.prototype.swap16 = function() {
                var t = this.length;
                if (t % 2 != 0)
                    throw new RangeError("Buffer size must be a multiple of 16-bits");
                for (var e = 0; e < t; e += 2)
                    d(this, e, e + 1);
                return this
            }
            ,
            h.prototype.swap32 = function() {
                var t = this.length;
                if (t % 4 != 0)
                    throw new RangeError("Buffer size must be a multiple of 32-bits");
                for (var e = 0; e < t; e += 4)
                    d(this, e, e + 3),
                    d(this, e + 1, e + 2);
                return this
            }
            ,
            h.prototype.swap64 = function() {
                var t = this.length;
                if (t % 8 != 0)
                    throw new RangeError("Buffer size must be a multiple of 64-bits");
                for (var e = 0; e < t; e += 8)
                    d(this, e, e + 7),
                    d(this, e + 1, e + 6),
                    d(this, e + 2, e + 5),
                    d(this, e + 3, e + 4);
                return this
            }
            ,
            h.prototype.toString = function() {
                var t = 0 | this.length;
                return 0 == t ? "" : 0 === arguments.length ? v(this, 0, t) : e.apply(this, arguments)
            }
            ,
            h.prototype.equals = function(t) {
                if (!h.isBuffer(t))
                    throw new TypeError("Argument must be a Buffer");
                return this === t || 0 === h.compare(this, t)
            }
            ,
            h.prototype.inspect = function() {
                var t = ""
                  , e = I.INSPECT_MAX_BYTES;
                return 0 < this.length && (t = this.toString("hex", 0, e).match(/.{2}/g).join(" "),
                this.length > e && (t += " ... ")),
                "<Buffer " + t + ">"
            }
            ,
            h.prototype.compare = function(t, e, r, n, o) {
                if (!h.isBuffer(t))
                    throw new TypeError("Argument must be a Buffer");
                if (void 0 === e && (e = 0),
                void 0 === r && (r = t ? t.length : 0),
                void 0 === n && (n = 0),
                void 0 === o && (o = this.length),
                e < 0 || r > t.length || n < 0 || o > this.length)
                    throw new RangeError("out of range index");
                if (o <= n && r <= e)
                    return 0;
                if (o <= n)
                    return -1;
                if (r <= e)
                    return 1;
                if (this === t)
                    return 0;
                for (var i = (o >>>= 0) - (n >>>= 0), s = (r >>>= 0) - (e >>>= 0), a = Math.min(i, s), c = this.slice(n, o), u = t.slice(e, r), p = 0; p < a; ++p)
                    if (c[p] !== u[p]) {
                        i = c[p],
                        s = u[p];
                        break
                    }
                return i < s ? -1 : s < i ? 1 : 0
            }
            ,
            h.prototype.includes = function(t, e, r) {
                return -1 !== this.indexOf(t, e, r)
            }
            ,
            h.prototype.indexOf = function(t, e, r) {
                return y(this, t, e, r, !0)
            }
            ,
            h.prototype.lastIndexOf = function(t, e, r) {
                return y(this, t, e, r, !1)
            }
            ,
            h.prototype.write = function(t, e, r, n) {
                if (void 0 === e)
                    n = "utf8",
                    r = this.length,
                    e = 0;
                else if (void 0 === r && "string" == typeof e)
                    n = e,
                    r = this.length,
                    e = 0;
                else {
                    if (!isFinite(e))
                        throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
                    e |= 0,
                    isFinite(r) ? (r |= 0,
                    void 0 === n && (n = "utf8")) : (n = r,
                    r = void 0)
                }
                var o = this.length - e;
                if ((void 0 === r || o < r) && (r = o),
                0 < t.length && (r < 0 || e < 0) || e > this.length)
                    throw new RangeError("Attempt to write outside buffer bounds");
                n = n || "utf8";
                for (var i, s, a, c, u, p, h = !1; ; )
                    switch (n) {
                    case "hex":
                        return function(t, e, r, n) {
                            r = Number(r) || 0;
                            var o = t.length - r;
                            (!n || o < (n = Number(n))) && (n = o);
                            var i = e.length;
                            if (i % 2 != 0)
                                throw new TypeError("Invalid hex string");
                            i / 2 < n && (n = i / 2);
                            for (var s = 0; s < n; ++s) {
                                var a = parseInt(e.substr(2 * s, 2), 16);
                                if (isNaN(a))
                                    return s;
                                t[r + s] = a
                            }
                            return s
                        }(this, t, e, r);
                    case "utf8":
                    case "utf-8":
                        return u = e,
                        p = r,
                        P(R(t, (c = this).length - u), c, u, p);
                    case "ascii":
                        return m(this, t, e, r);
                    case "latin1":
                    case "binary":
                        return m(this, t, e, r);
                    case "base64":
                        return i = this,
                        s = e,
                        a = r,
                        P(O(t), i, s, a);
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return b(this, t, e, r);
                    default:
                        if (h)
                            throw new TypeError("Unknown encoding: " + n);
                        n = ("" + n).toLowerCase(),
                        h = !0
                    }
            }
            ,
            h.prototype.toJSON = function() {
                return {
                    type: "Buffer",
                    data: Array.prototype.slice.call(this._arr || this, 0)
                }
            }
            ;
            var w = 4096;
            function _(t, e, r) {
                if (t % 1 != 0 || t < 0)
                    throw new RangeError("offset is not uint");
                if (r < t + e)
                    throw new RangeError("Trying to access beyond buffer length")
            }
            function k(t, e, r, n, o, i) {
                if (!h.isBuffer(t))
                    throw new TypeError('"buffer" argument must be a Buffer instance');
                if (o < e || e < i)
                    throw new RangeError('"value" argument is out of bounds');
                if (r + n > t.length)
                    throw new RangeError("Index out of range")
            }
            function T(t, e, r, n) {
                e < 0 && (e = 65535 + e + 1);
                for (var o = 0, i = Math.min(t.length - r, 2); o < i; ++o)
                    t[r + o] = (e & 255 << 8 * (n ? o : 1 - o)) >>> 8 * (n ? o : 1 - o)
            }
            function A(t, e, r, n) {
                e < 0 && (e = 4294967295 + e + 1);
                for (var o = 0, i = Math.min(t.length - r, 4); o < i; ++o)
                    t[r + o] = e >>> 8 * (n ? o : 3 - o) & 255
            }
            function x(t, e, r, n) {
                if (r + n > t.length)
                    throw new RangeError("Index out of range");
                if (r < 0)
                    throw new RangeError("Index out of range")
            }
            function B(t, e, r, n, o) {
                return o || x(t, 0, r, 4),
                i.write(t, e, r, n, 23, 4),
                r + 4
            }
            function E(t, e, r, n, o) {
                return o || x(t, 0, r, 8),
                i.write(t, e, r, n, 52, 8),
                r + 8
            }
            h.prototype.slice = function(t, e) {
                var r = this.length;
                if ((t = ~~t) < 0 ? (t += r) < 0 && (t = 0) : r < t && (t = r),
                (e = void 0 === e ? r : ~~e) < 0 ? (e += r) < 0 && (e = 0) : r < e && (e = r),
                e < t && (e = t),
                h.TYPED_ARRAY_SUPPORT)
                    (o = this.subarray(t, e)).__proto__ = h.prototype;
                else
                    for (var n = e - t, o = new h(n,void 0), i = 0; i < n; ++i)
                        o[i] = this[i + t];
                return o
            }
            ,
            h.prototype.readUIntLE = function(t, e, r) {
                t |= 0,
                e |= 0,
                r || _(t, e, this.length);
                for (var n = this[t], o = 1, i = 0; ++i < e && (o *= 256); )
                    n += this[t + i] * o;
                return n
            }
            ,
            h.prototype.readUIntBE = function(t, e, r) {
                t |= 0,
                e |= 0,
                r || _(t, e, this.length);
                for (var n = this[t + --e], o = 1; 0 < e && (o *= 256); )
                    n += this[t + --e] * o;
                return n
            }
            ,
            h.prototype.readUInt8 = function(t, e) {
                return e || _(t, 1, this.length),
                this[t]
            }
            ,
            h.prototype.readUInt16LE = function(t, e) {
                return e || _(t, 2, this.length),
                this[t] | this[t + 1] << 8
            }
            ,
            h.prototype.readUInt16BE = function(t, e) {
                return e || _(t, 2, this.length),
                this[t] << 8 | this[t + 1]
            }
            ,
            h.prototype.readUInt32LE = function(t, e) {
                return e || _(t, 4, this.length),
                (this[t] | this[t + 1] << 8 | this[t + 2] << 16) + 16777216 * this[t + 3]
            }
            ,
            h.prototype.readUInt32BE = function(t, e) {
                return e || _(t, 4, this.length),
                16777216 * this[t] + (this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3])
            }
            ,
            h.prototype.readIntLE = function(t, e, r) {
                t |= 0,
                e |= 0,
                r || _(t, e, this.length);
                for (var n = this[t], o = 1, i = 0; ++i < e && (o *= 256); )
                    n += this[t + i] * o;
                return (o *= 128) <= n && (n -= Math.pow(2, 8 * e)),
                n
            }
            ,
            h.prototype.readIntBE = function(t, e, r) {
                t |= 0,
                e |= 0,
                r || _(t, e, this.length);
                for (var n = e, o = 1, i = this[t + --n]; 0 < n && (o *= 256); )
                    i += this[t + --n] * o;
                return (o *= 128) <= i && (i -= Math.pow(2, 8 * e)),
                i
            }
            ,
            h.prototype.readInt8 = function(t, e) {
                return e || _(t, 1, this.length),
                128 & this[t] ? -1 * (255 - this[t] + 1) : this[t]
            }
            ,
            h.prototype.readInt16LE = function(t, e) {
                e || _(t, 2, this.length);
                var r = this[t] | this[t + 1] << 8;
                return 32768 & r ? 4294901760 | r : r
            }
            ,
            h.prototype.readInt16BE = function(t, e) {
                e || _(t, 2, this.length);
                var r = this[t + 1] | this[t] << 8;
                return 32768 & r ? 4294901760 | r : r
            }
            ,
            h.prototype.readInt32LE = function(t, e) {
                return e || _(t, 4, this.length),
                this[t] | this[t + 1] << 8 | this[t + 2] << 16 | this[t + 3] << 24
            }
            ,
            h.prototype.readInt32BE = function(t, e) {
                return e || _(t, 4, this.length),
                this[t] << 24 | this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3]
            }
            ,
            h.prototype.readFloatLE = function(t, e) {
                return e || _(t, 4, this.length),
                i.read(this, t, !0, 23, 4)
            }
            ,
            h.prototype.readFloatBE = function(t, e) {
                return e || _(t, 4, this.length),
                i.read(this, t, !1, 23, 4)
            }
            ,
            h.prototype.readDoubleLE = function(t, e) {
                return e || _(t, 8, this.length),
                i.read(this, t, !0, 52, 8)
            }
            ,
            h.prototype.readDoubleBE = function(t, e) {
                return e || _(t, 8, this.length),
                i.read(this, t, !1, 52, 8)
            }
            ,
            h.prototype.writeUIntLE = function(t, e, r, n) {
                t = +t,
                e |= 0,
                r |= 0,
                n || k(this, t, e, r, Math.pow(2, 8 * r) - 1, 0);
                var o = 1
                  , i = 0;
                for (this[e] = 255 & t; ++i < r && (o *= 256); )
                    this[e + i] = t / o & 255;
                return e + r
            }
            ,
            h.prototype.writeUIntBE = function(t, e, r, n) {
                t = +t,
                e |= 0,
                r |= 0,
                n || k(this, t, e, r, Math.pow(2, 8 * r) - 1, 0);
                var o = r - 1
                  , i = 1;
                for (this[e + o] = 255 & t; 0 <= --o && (i *= 256); )
                    this[e + o] = t / i & 255;
                return e + r
            }
            ,
            h.prototype.writeUInt8 = function(t, e, r) {
                return t = +t,
                e |= 0,
                r || k(this, t, e, 1, 255, 0),
                h.TYPED_ARRAY_SUPPORT || (t = Math.floor(t)),
                this[e] = 255 & t,
                e + 1
            }
            ,
            h.prototype.writeUInt16LE = function(t, e, r) {
                return t = +t,
                e |= 0,
                r || k(this, t, e, 2, 65535, 0),
                h.TYPED_ARRAY_SUPPORT ? (this[e] = 255 & t,
                this[e + 1] = t >>> 8) : T(this, t, e, !0),
                e + 2
            }
            ,
            h.prototype.writeUInt16BE = function(t, e, r) {
                return t = +t,
                e |= 0,
                r || k(this, t, e, 2, 65535, 0),
                h.TYPED_ARRAY_SUPPORT ? (this[e] = t >>> 8,
                this[e + 1] = 255 & t) : T(this, t, e, !1),
                e + 2
            }
            ,
            h.prototype.writeUInt32LE = function(t, e, r) {
                return t = +t,
                e |= 0,
                r || k(this, t, e, 4, 4294967295, 0),
                h.TYPED_ARRAY_SUPPORT ? (this[e + 3] = t >>> 24,
                this[e + 2] = t >>> 16,
                this[e + 1] = t >>> 8,
                this[e] = 255 & t) : A(this, t, e, !0),
                e + 4
            }
            ,
            h.prototype.writeUInt32BE = function(t, e, r) {
                return t = +t,
                e |= 0,
                r || k(this, t, e, 4, 4294967295, 0),
                h.TYPED_ARRAY_SUPPORT ? (this[e] = t >>> 24,
                this[e + 1] = t >>> 16,
                this[e + 2] = t >>> 8,
                this[e + 3] = 255 & t) : A(this, t, e, !1),
                e + 4
            }
            ,
            h.prototype.writeIntLE = function(t, e, r, n) {
                var o;
                t = +t,
                e |= 0,
                n || k(this, t, e, r, (o = Math.pow(2, 8 * r - 1)) - 1, -o);
                var i = 0
                  , s = 1
                  , a = 0;
                for (this[e] = 255 & t; ++i < r && (s *= 256); )
                    t < 0 && 0 === a && 0 !== this[e + i - 1] && (a = 1),
                    this[e + i] = (t / s >> 0) - a & 255;
                return e + r
            }
            ,
            h.prototype.writeIntBE = function(t, e, r, n) {
                var o;
                t = +t,
                e |= 0,
                n || k(this, t, e, r, (o = Math.pow(2, 8 * r - 1)) - 1, -o);
                var i = r - 1
                  , s = 1
                  , a = 0;
                for (this[e + i] = 255 & t; 0 <= --i && (s *= 256); )
                    t < 0 && 0 === a && 0 !== this[e + i + 1] && (a = 1),
                    this[e + i] = (t / s >> 0) - a & 255;
                return e + r
            }
            ,
            h.prototype.writeInt8 = function(t, e, r) {
                return t = +t,
                e |= 0,
                r || k(this, t, e, 1, 127, -128),
                h.TYPED_ARRAY_SUPPORT || (t = Math.floor(t)),
                t < 0 && (t = 255 + t + 1),
                this[e] = 255 & t,
                e + 1
            }
            ,
            h.prototype.writeInt16LE = function(t, e, r) {
                return t = +t,
                e |= 0,
                r || k(this, t, e, 2, 32767, -32768),
                h.TYPED_ARRAY_SUPPORT ? (this[e] = 255 & t,
                this[e + 1] = t >>> 8) : T(this, t, e, !0),
                e + 2
            }
            ,
            h.prototype.writeInt16BE = function(t, e, r) {
                return t = +t,
                e |= 0,
                r || k(this, t, e, 2, 32767, -32768),
                h.TYPED_ARRAY_SUPPORT ? (this[e] = t >>> 8,
                this[e + 1] = 255 & t) : T(this, t, e, !1),
                e + 2
            }
            ,
            h.prototype.writeInt32LE = function(t, e, r) {
                return t = +t,
                e |= 0,
                r || k(this, t, e, 4, 2147483647, -2147483648),
                h.TYPED_ARRAY_SUPPORT ? (this[e] = 255 & t,
                this[e + 1] = t >>> 8,
                this[e + 2] = t >>> 16,
                this[e + 3] = t >>> 24) : A(this, t, e, !0),
                e + 4
            }
            ,
            h.prototype.writeInt32BE = function(t, e, r) {
                return t = +t,
                e |= 0,
                r || k(this, t, e, 4, 2147483647, -2147483648),
                t < 0 && (t = 4294967295 + t + 1),
                h.TYPED_ARRAY_SUPPORT ? (this[e] = t >>> 24,
                this[e + 1] = t >>> 16,
                this[e + 2] = t >>> 8,
                this[e + 3] = 255 & t) : A(this, t, e, !1),
                e + 4
            }
            ,
            h.prototype.writeFloatLE = function(t, e, r) {
                return B(this, t, e, !0, r)
            }
            ,
            h.prototype.writeFloatBE = function(t, e, r) {
                return B(this, t, e, !1, r)
            }
            ,
            h.prototype.writeDoubleLE = function(t, e, r) {
                return E(this, t, e, !0, r)
            }
            ,
            h.prototype.writeDoubleBE = function(t, e, r) {
                return E(this, t, e, !1, r)
            }
            ,
            h.prototype.copy = function(t, e, r, n) {
                if (r = r || 0,
                n || 0 === n || (n = this.length),
                e >= t.length && (e = t.length),
                e = e || 0,
                0 < n && n < r && (n = r),
                n === r)
                    return 0;
                if (0 === t.length || 0 === this.length)
                    return 0;
                if (e < 0)
                    throw new RangeError("targetStart out of bounds");
                if (r < 0 || r >= this.length)
                    throw new RangeError("sourceStart out of bounds");
                if (n < 0)
                    throw new RangeError("sourceEnd out of bounds");
                n > this.length && (n = this.length),
                t.length - e < n - r && (n = t.length - e + r);
                var o, i = n - r;
                if (this === t && r < e && e < n)
                    for (o = i - 1; 0 <= o; --o)
                        t[o + e] = this[o + r];
                else if (i < 1e3 || !h.TYPED_ARRAY_SUPPORT)
                    for (o = 0; o < i; ++o)
                        t[o + e] = this[o + r];
                else
                    Uint8Array.prototype.set.call(t, this.subarray(r, r + i), e);
                return i
            }
            ,
            h.prototype.fill = function(t, e, r, n) {
                if ("string" == typeof t) {
                    var o;
                    if ("string" == typeof e ? (n = e,
                    e = 0,
                    r = this.length) : "string" == typeof r && (n = r,
                    r = this.length),
                    1 !== t.length || (o = t.charCodeAt(0)) < 256 && (t = o),
                    void 0 !== n && "string" != typeof n)
                        throw new TypeError("encoding must be a string");
                    if ("string" == typeof n && !h.isEncoding(n))
                        throw new TypeError("Unknown encoding: " + n)
                } else
                    "number" == typeof t && (t &= 255);
                if (e < 0 || this.length < e || this.length < r)
                    throw new RangeError("Out of range index");
                if (r <= e)
                    return this;
                if (e >>>= 0,
                r = void 0 === r ? this.length : r >>> 0,
                "number" == typeof (t = t || 0))
                    for (a = e; a < r; ++a)
                        this[a] = t;
                else
                    for (var i = h.isBuffer(t) ? t : R(new h(t,n).toString()), s = i.length, a = 0; a < r - e; ++a)
                        this[a + e] = i[a % s];
                return this
            }
            ;
            var S = /[^+\/0-9A-Za-z-_]/g;
            function R(t, e) {
                var r;
                e = e || 1 / 0;
                for (var n = t.length, o = null, i = [], s = 0; s < n; ++s) {
                    if (55295 < (r = t.charCodeAt(s)) && r < 57344) {
                        if (!o) {
                            if (56319 < r) {
                                -1 < (e -= 3) && i.push(239, 191, 189);
                                continue
                            }
                            if (s + 1 === n) {
                                -1 < (e -= 3) && i.push(239, 191, 189);
                                continue
                            }
                            o = r;
                            continue
                        }
                        if (r < 56320) {
                            -1 < (e -= 3) && i.push(239, 191, 189),
                            o = r;
                            continue
                        }
                        r = 65536 + (o - 55296 << 10 | r - 56320)
                    } else
                        o && -1 < (e -= 3) && i.push(239, 191, 189);
                    if (o = null,
                    r < 128) {
                        if (--e < 0)
                            break;
                        i.push(r)
                    } else if (r < 2048) {
                        if ((e -= 2) < 0)
                            break;
                        i.push(r >> 6 | 192, 63 & r | 128)
                    } else if (r < 65536) {
                        if ((e -= 3) < 0)
                            break;
                        i.push(r >> 12 | 224, r >> 6 & 63 | 128, 63 & r | 128)
                    } else {
                        if (!(r < 1114112))
                            throw new Error("Invalid code point");
                        if ((e -= 4) < 0)
                            break;
                        i.push(r >> 18 | 240, r >> 12 & 63 | 128, r >> 6 & 63 | 128, 63 & r | 128)
                    }
                }
                return i
            }
            function O(t) {
                return a.toByteArray(function(t) {
                    var e;
                    if ((t = ((e = t).trim ? e.trim() : e.replace(/^\s+|\s+$/g, "")).replace(S, "")).length < 2)
                        return "";
                    for (; t.length % 4 != 0; )
                        t += "=";
                    return t
                }(t))
            }
            function P(t, e, r, n) {
                for (var o = 0; o < n && !(o + r >= e.length || o >= t.length); ++o)
                    e[o + r] = t[o];
                return o
            }
        }
        ).call(this, C(1))
    }
});
;/*!
 * Materialize v0.97.5 (http://materializecss.com)
 * Copyright 2014-2015 Materialize
 * MIT License (https://raw.githubusercontent.com/Dogfalo/materialize/master/LICENSE)
 */
if ("undefined" == typeof jQuery) {
    var jQuery;
    jQuery = "function" == typeof require ? $ = require("jQuery") : $
}
jQuery.easing.jswing = jQuery.easing.swing,
jQuery.extend(jQuery.easing, {
    def: "easeOutQuad",
    swing: function(a, b, c, d, e) {
        return jQuery.easing[jQuery.easing.def](a, b, c, d, e)
    },
    easeInQuad: function(a, b, c, d, e) {
        return d * (b /= e) * b + c
    },
    easeOutQuad: function(a, b, c, d, e) {
        return -d * (b /= e) * (b - 2) + c
    },
    easeInOutQuad: function(a, b, c, d, e) {
        return (b /= e / 2) < 1 ? d / 2 * b * b + c : -d / 2 * (--b * (b - 2) - 1) + c
    },
    easeInCubic: function(a, b, c, d, e) {
        return d * (b /= e) * b * b + c
    },
    easeOutCubic: function(a, b, c, d, e) {
        return d * ((b = b / e - 1) * b * b + 1) + c
    },
    easeInOutCubic: function(a, b, c, d, e) {
        return (b /= e / 2) < 1 ? d / 2 * b * b * b + c : d / 2 * ((b -= 2) * b * b + 2) + c
    },
    easeInQuart: function(a, b, c, d, e) {
        return d * (b /= e) * b * b * b + c
    },
    easeOutQuart: function(a, b, c, d, e) {
        return -d * ((b = b / e - 1) * b * b * b - 1) + c
    },
    easeInOutQuart: function(a, b, c, d, e) {
        return (b /= e / 2) < 1 ? d / 2 * b * b * b * b + c : -d / 2 * ((b -= 2) * b * b * b - 2) + c
    },
    easeInQuint: function(a, b, c, d, e) {
        return d * (b /= e) * b * b * b * b + c
    },
    easeOutQuint: function(a, b, c, d, e) {
        return d * ((b = b / e - 1) * b * b * b * b + 1) + c
    },
    easeInOutQuint: function(a, b, c, d, e) {
        return (b /= e / 2) < 1 ? d / 2 * b * b * b * b * b + c : d / 2 * ((b -= 2) * b * b * b * b + 2) + c
    },
    easeInSine: function(a, b, c, d, e) {
        return -d * Math.cos(b / e * (Math.PI / 2)) + d + c
    },
    easeOutSine: function(a, b, c, d, e) {
        return d * Math.sin(b / e * (Math.PI / 2)) + c
    },
    easeInOutSine: function(a, b, c, d, e) {
        return -d / 2 * (Math.cos(Math.PI * b / e) - 1) + c
    },
    easeInExpo: function(a, b, c, d, e) {
        return 0 == b ? c : d * Math.pow(2, 10 * (b / e - 1)) + c
    },
    easeOutExpo: function(a, b, c, d, e) {
        return b == e ? c + d : d * (-Math.pow(2, -10 * b / e) + 1) + c
    },
    easeInOutExpo: function(a, b, c, d, e) {
        return 0 == b ? c : b == e ? c + d : (b /= e / 2) < 1 ? d / 2 * Math.pow(2, 10 * (b - 1)) + c : d / 2 * (-Math.pow(2, -10 * --b) + 2) + c
    },
    easeInCirc: function(a, b, c, d, e) {
        return -d * (Math.sqrt(1 - (b /= e) * b) - 1) + c
    },
    easeOutCirc: function(a, b, c, d, e) {
        return d * Math.sqrt(1 - (b = b / e - 1) * b) + c
    },
    easeInOutCirc: function(a, b, c, d, e) {
        return (b /= e / 2) < 1 ? -d / 2 * (Math.sqrt(1 - b * b) - 1) + c : d / 2 * (Math.sqrt(1 - (b -= 2) * b) + 1) + c
    },
    easeInElastic: function(a, b, c, d, e) {
        var f = 1.70158
          , g = 0
          , h = d;
        if (0 == b)
            return c;
        if (1 == (b /= e))
            return c + d;
        if (g || (g = .3 * e),
        h < Math.abs(d)) {
            h = d;
            var f = g / 4
        } else
            var f = g / (2 * Math.PI) * Math.asin(d / h);
        return -(h * Math.pow(2, 10 * (b -= 1)) * Math.sin((b * e - f) * (2 * Math.PI) / g)) + c
    },
    easeOutElastic: function(a, b, c, d, e) {
        var f = 1.70158
          , g = 0
          , h = d;
        if (0 == b)
            return c;
        if (1 == (b /= e))
            return c + d;
        if (g || (g = .3 * e),
        h < Math.abs(d)) {
            h = d;
            var f = g / 4
        } else
            var f = g / (2 * Math.PI) * Math.asin(d / h);
        return h * Math.pow(2, -10 * b) * Math.sin((b * e - f) * (2 * Math.PI) / g) + d + c
    },
    easeInOutElastic: function(a, b, c, d, e) {
        var f = 1.70158
          , g = 0
          , h = d;
        if (0 == b)
            return c;
        if (2 == (b /= e / 2))
            return c + d;
        if (g || (g = e * (.3 * 1.5)),
        h < Math.abs(d)) {
            h = d;
            var f = g / 4
        } else
            var f = g / (2 * Math.PI) * Math.asin(d / h);
        return 1 > b ? -.5 * (h * Math.pow(2, 10 * (b -= 1)) * Math.sin((b * e - f) * (2 * Math.PI) / g)) + c : h * Math.pow(2, -10 * (b -= 1)) * Math.sin((b * e - f) * (2 * Math.PI) / g) * .5 + d + c
    },
    easeInBack: function(a, b, c, d, e, f) {
        return void 0 == f && (f = 1.70158),
        d * (b /= e) * b * ((f + 1) * b - f) + c
    },
    easeOutBack: function(a, b, c, d, e, f) {
        return void 0 == f && (f = 1.70158),
        d * ((b = b / e - 1) * b * ((f + 1) * b + f) + 1) + c
    },
    easeInOutBack: function(a, b, c, d, e, f) {
        return void 0 == f && (f = 1.70158),
        (b /= e / 2) < 1 ? d / 2 * (b * b * (((f *= 1.525) + 1) * b - f)) + c : d / 2 * ((b -= 2) * b * (((f *= 1.525) + 1) * b + f) + 2) + c
    },
    easeInBounce: function(a, b, c, d, e) {
        return d - jQuery.easing.easeOutBounce(a, e - b, 0, d, e) + c
    },
    easeOutBounce: function(a, b, c, d, e) {
        return (b /= e) < 1 / 2.75 ? d * (7.5625 * b * b) + c : 2 / 2.75 > b ? d * (7.5625 * (b -= 1.5 / 2.75) * b + .75) + c : 2.5 / 2.75 > b ? d * (7.5625 * (b -= 2.25 / 2.75) * b + .9375) + c : d * (7.5625 * (b -= 2.625 / 2.75) * b + .984375) + c
    },
    easeInOutBounce: function(a, b, c, d, e) {
        return e / 2 > b ? .5 * jQuery.easing.easeInBounce(a, 2 * b, 0, d, e) + c : .5 * jQuery.easing.easeOutBounce(a, 2 * b - e, 0, d, e) + .5 * d + c
    }
}),
jQuery.extend(jQuery.easing, {
    easeInOutMaterial: function(a, b, c, d, e) {
        return (b /= e / 2) < 1 ? d / 2 * b * b + c : d / 4 * ((b -= 2) * b * b + 2) + c
    }
}),
jQuery.Velocity ? console.log("Velocity is already loaded. You may be needlessly importing Velocity again; note that Materialize includes Velocity.") : (!function(a) {
    function b(a) {
        var b = a.length
          , d = c.type(a);
        return "function" === d || c.isWindow(a) ? !1 : 1 === a.nodeType && b ? !0 : "array" === d || 0 === b || "number" == typeof b && b > 0 && b - 1 in a
    }
    if (!a.jQuery) {
        var c = function(a, b) {
            return new c.fn.init(a,b)
        };
        c.isWindow = function(a) {
            return null != a && a == a.window
        }
        ,
        c.type = function(a) {
            return null == a ? a + "" : "object" == typeof a || "function" == typeof a ? e[g.call(a)] || "object" : typeof a
        }
        ,
        c.isArray = Array.isArray || function(a) {
            return "array" === c.type(a)
        }
        ,
        c.isPlainObject = function(a) {
            var b;
            if (!a || "object" !== c.type(a) || a.nodeType || c.isWindow(a))
                return !1;
            try {
                if (a.constructor && !f.call(a, "constructor") && !f.call(a.constructor.prototype, "isPrototypeOf"))
                    return !1
            } catch (d) {
                return !1
            }
            for (b in a)
                ;
            return void 0 === b || f.call(a, b)
        }
        ,
        c.each = function(a, c, d) {
            var e, f = 0, g = a.length, h = b(a);
            if (d) {
                if (h)
                    for (; g > f && (e = c.apply(a[f], d),
                    e !== !1); f++)
                        ;
                else
                    for (f in a)
                        if (e = c.apply(a[f], d),
                        e === !1)
                            break
            } else if (h)
                for (; g > f && (e = c.call(a[f], f, a[f]),
                e !== !1); f++)
                    ;
            else
                for (f in a)
                    if (e = c.call(a[f], f, a[f]),
                    e === !1)
                        break;
            return a
        }
        ,
        c.data = function(a, b, e) {
            if (void 0 === e) {
                var f = a[c.expando]
                  , g = f && d[f];
                if (void 0 === b)
                    return g;
                if (g && b in g)
                    return g[b]
            } else if (void 0 !== b) {
                var f = a[c.expando] || (a[c.expando] = ++c.uuid);
                return d[f] = d[f] || {},
                d[f][b] = e,
                e
            }
        }
        ,
        c.removeData = function(a, b) {
            var e = a[c.expando]
              , f = e && d[e];
            f && c.each(b, function(a, b) {
                delete f[b]
            })
        }
        ,
        c.extend = function() {
            var a, b, d, e, f, g, h = arguments[0] || {}, i = 1, j = arguments.length, k = !1;
            for ("boolean" == typeof h && (k = h,
            h = arguments[i] || {},
            i++),
            "object" != typeof h && "function" !== c.type(h) && (h = {}),
            i === j && (h = this,
            i--); j > i; i++)
                if (null != (f = arguments[i]))
                    for (e in f)
                        a = h[e],
                        d = f[e],
                        h !== d && (k && d && (c.isPlainObject(d) || (b = c.isArray(d))) ? (b ? (b = !1,
                        g = a && c.isArray(a) ? a : []) : g = a && c.isPlainObject(a) ? a : {},
                        h[e] = c.extend(k, g, d)) : void 0 !== d && (h[e] = d));
            return h
        }
        ,
        c.queue = function(a, d, e) {
            function f(a, c) {
                var d = c || [];
                return null != a && (b(Object(a)) ? !function(a, b) {
                    for (var c = +b.length, d = 0, e = a.length; c > d; )
                        a[e++] = b[d++];
                    if (c !== c)
                        for (; void 0 !== b[d]; )
                            a[e++] = b[d++];
                    return a.length = e,
                    a
                }(d, "string" == typeof a ? [a] : a) : [].push.call(d, a)),
                d
            }
            if (a) {
                d = (d || "fx") + "queue";
                var g = c.data(a, d);
                return e ? (!g || c.isArray(e) ? g = c.data(a, d, f(e)) : g.push(e),
                g) : g || []
            }
        }
        ,
        c.dequeue = function(a, b) {
            c.each(a.nodeType ? [a] : a, function(a, d) {
                b = b || "fx";
                var e = c.queue(d, b)
                  , f = e.shift();
                "inprogress" === f && (f = e.shift()),
                f && ("fx" === b && e.unshift("inprogress"),
                f.call(d, function() {
                    c.dequeue(d, b)
                }))
            })
        }
        ,
        c.fn = c.prototype = {
            init: function(a) {
                if (a.nodeType)
                    return this[0] = a,
                    this;
                throw new Error("Not a DOM node.")
            },
            offset: function() {
                var b = this[0].getBoundingClientRect ? this[0].getBoundingClientRect() : {
                    top: 0,
                    left: 0
                };
                return {
                    top: b.top + (a.pageYOffset || document.scrollTop || 0) - (document.clientTop || 0),
                    left: b.left + (a.pageXOffset || document.scrollLeft || 0) - (document.clientLeft || 0)
                }
            },
            position: function() {
                function a() {
                    for (var a = this.offsetParent || document; a && "html" === !a.nodeType.toLowerCase && "static" === a.style.position; )
                        a = a.offsetParent;
                    return a || document
                }
                var b = this[0]
                  , a = a.apply(b)
                  , d = this.offset()
                  , e = /^(?:body|html)$/i.test(a.nodeName) ? {
                    top: 0,
                    left: 0
                } : c(a).offset();
                return d.top -= parseFloat(b.style.marginTop) || 0,
                d.left -= parseFloat(b.style.marginLeft) || 0,
                a.style && (e.top += parseFloat(a.style.borderTopWidth) || 0,
                e.left += parseFloat(a.style.borderLeftWidth) || 0),
                {
                    top: d.top - e.top,
                    left: d.left - e.left
                }
            }
        };
        var d = {};
        c.expando = "velocity" + (new Date).getTime(),
        c.uuid = 0;
        for (var e = {}, f = e.hasOwnProperty, g = e.toString, h = "Boolean Number String Function Array Date RegExp Object Error".split(" "), i = 0; i < h.length; i++)
            e["[object " + h[i] + "]"] = h[i].toLowerCase();
        c.fn.init.prototype = c.fn,
        a.Velocity = {
            Utilities: c
        }
    }
}(window),
function(a) {
    "object" == typeof module && "object" == typeof module.exports ? module.exports = a() : "function" == typeof define && false ? define(a) : a()
}(function() {
    return function(a, b, c, d) {
        function e(a) {
            for (var b = -1, c = a ? a.length : 0, d = []; ++b < c; ) {
                var e = a[b];
                e && d.push(e)
            }
            return d
        }
        function f(a) {
            return p.isWrapped(a) ? a = [].slice.call(a) : p.isNode(a) && (a = [a]),
            a
        }
        function g(a) {
            var b = m.data(a, "velocity");
            return null === b ? d : b
        }
        function h(a) {
            return function(b) {
                return Math.round(b * a) * (1 / a)
            }
        }
        function i(a, c, d, e) {
            function f(a, b) {
                return 1 - 3 * b + 3 * a
            }
            function g(a, b) {
                return 3 * b - 6 * a
            }
            function h(a) {
                return 3 * a
            }
            function i(a, b, c) {
                return ((f(b, c) * a + g(b, c)) * a + h(b)) * a
            }
            function j(a, b, c) {
                return 3 * f(b, c) * a * a + 2 * g(b, c) * a + h(b)
            }
            function k(b, c) {
                for (var e = 0; p > e; ++e) {
                    var f = j(c, a, d);
                    if (0 === f)
                        return c;
                    var g = i(c, a, d) - b;
                    c -= g / f
                }
                return c
            }
            function l() {
                for (var b = 0; t > b; ++b)
                    x[b] = i(b * u, a, d)
            }
            function m(b, c, e) {
                var f, g, h = 0;
                do
                    g = c + (e - c) / 2,
                    f = i(g, a, d) - b,
                    f > 0 ? e = g : c = g;
                while (Math.abs(f) > r && ++h < s);return g
            }
            function n(b) {
                for (var c = 0, e = 1, f = t - 1; e != f && x[e] <= b; ++e)
                    c += u;
                --e;
                var g = (b - x[e]) / (x[e + 1] - x[e])
                  , h = c + g * u
                  , i = j(h, a, d);
                return i >= q ? k(b, h) : 0 == i ? h : m(b, c, c + u)
            }
            function o() {
                y = !0,
                (a != c || d != e) && l()
            }
            var p = 4
              , q = .001
              , r = 1e-7
              , s = 10
              , t = 11
              , u = 1 / (t - 1)
              , v = "Float32Array"in b;
            if (4 !== arguments.length)
                return !1;
            for (var w = 0; 4 > w; ++w)
                if ("number" != typeof arguments[w] || isNaN(arguments[w]) || !isFinite(arguments[w]))
                    return !1;
            a = Math.min(a, 1),
            d = Math.min(d, 1),
            a = Math.max(a, 0),
            d = Math.max(d, 0);
            var x = v ? new Float32Array(t) : new Array(t)
              , y = !1
              , z = function(b) {
                return y || o(),
                a === c && d === e ? b : 0 === b ? 0 : 1 === b ? 1 : i(n(b), c, e)
            };
            z.getControlPoints = function() {
                return [{
                    x: a,
                    y: c
                }, {
                    x: d,
                    y: e
                }]
            }
            ;
            var A = "generateBezier(" + [a, c, d, e] + ")";
            return z.toString = function() {
                return A
            }
            ,
            z
        }
        function j(a, b) {
            var c = a;
            return p.isString(a) ? t.Easings[a] || (c = !1) : c = p.isArray(a) && 1 === a.length ? h.apply(null, a) : p.isArray(a) && 2 === a.length ? u.apply(null, a.concat([b])) : p.isArray(a) && 4 === a.length ? i.apply(null, a) : !1,
            c === !1 && (c = t.Easings[t.defaults.easing] ? t.defaults.easing : s),
            c
        }
        function k(a) {
            if (a) {
                var b = (new Date).getTime()
                  , c = t.State.calls.length;
                c > 1e4 && (t.State.calls = e(t.State.calls));
                for (var f = 0; c > f; f++)
                    if (t.State.calls[f]) {
                        var h = t.State.calls[f]
                          , i = h[0]
                          , j = h[2]
                          , n = h[3]
                          , o = !!n
                          , q = null;
                        n || (n = t.State.calls[f][3] = b - 16);
                        for (var r = Math.min((b - n) / j.duration, 1), s = 0, u = i.length; u > s; s++) {
                            var w = i[s]
                              , y = w.element;
                            if (g(y)) {
                                var z = !1;
                                if (j.display !== d && null !== j.display && "none" !== j.display) {
                                    if ("flex" === j.display) {
                                        var A = ["-webkit-box", "-moz-box", "-ms-flexbox", "-webkit-flex"];
                                        m.each(A, function(a, b) {
                                            v.setPropertyValue(y, "display", b)
                                        })
                                    }
                                    v.setPropertyValue(y, "display", j.display)
                                }
                                j.visibility !== d && "hidden" !== j.visibility && v.setPropertyValue(y, "visibility", j.visibility);
                                for (var B in w)
                                    if ("element" !== B) {
                                        var C, D = w[B], E = p.isString(D.easing) ? t.Easings[D.easing] : D.easing;
                                        if (1 === r)
                                            C = D.endValue;
                                        else {
                                            var F = D.endValue - D.startValue;
                                            if (C = D.startValue + F * E(r, j, F),
                                            !o && C === D.currentValue)
                                                continue
                                        }
                                        if (D.currentValue = C,
                                        "tween" === B)
                                            q = C;
                                        else {
                                            if (v.Hooks.registered[B]) {
                                                var G = v.Hooks.getRoot(B)
                                                  , H = g(y).rootPropertyValueCache[G];
                                                H && (D.rootPropertyValue = H)
                                            }
                                            var I = v.setPropertyValue(y, B, D.currentValue + (0 === parseFloat(C) ? "" : D.unitType), D.rootPropertyValue, D.scrollData);
                                            v.Hooks.registered[B] && (g(y).rootPropertyValueCache[G] = v.Normalizations.registered[G] ? v.Normalizations.registered[G]("extract", null, I[1]) : I[1]),
                                            "transform" === I[0] && (z = !0)
                                        }
                                    }
                                j.mobileHA && g(y).transformCache.translate3d === d && (g(y).transformCache.translate3d = "(0px, 0px, 0px)",
                                z = !0),
                                z && v.flushTransformCache(y)
                            }
                        }
                        j.display !== d && "none" !== j.display && (t.State.calls[f][2].display = !1),
                        j.visibility !== d && "hidden" !== j.visibility && (t.State.calls[f][2].visibility = !1),
                        j.progress && j.progress.call(h[1], h[1], r, Math.max(0, n + j.duration - b), n, q),
                        1 === r && l(f)
                    }
            }
            t.State.isTicking && x(k)
        }
        function l(a, b) {
            if (!t.State.calls[a])
                return !1;
            for (var c = t.State.calls[a][0], e = t.State.calls[a][1], f = t.State.calls[a][2], h = t.State.calls[a][4], i = !1, j = 0, k = c.length; k > j; j++) {
                var l = c[j].element;
                if (b || f.loop || ("none" === f.display && v.setPropertyValue(l, "display", f.display),
                "hidden" === f.visibility && v.setPropertyValue(l, "visibility", f.visibility)),
                f.loop !== !0 && (m.queue(l)[1] === d || !/\.velocityQueueEntryFlag/i.test(m.queue(l)[1])) && g(l)) {
                    g(l).isAnimating = !1,
                    g(l).rootPropertyValueCache = {};
                    var n = !1;
                    m.each(v.Lists.transforms3D, function(a, b) {
                        var c = /^scale/.test(b) ? 1 : 0
                          , e = g(l).transformCache[b];
                        g(l).transformCache[b] !== d && new RegExp("^\\(" + c + "[^.]").test(e) && (n = !0,
                        delete g(l).transformCache[b])
                    }),
                    f.mobileHA && (n = !0,
                    delete g(l).transformCache.translate3d),
                    n && v.flushTransformCache(l),
                    v.Values.removeClass(l, "velocity-animating")
                }
                if (!b && f.complete && !f.loop && j === k - 1)
                    try {
                        f.complete.call(e, e)
                    } catch (o) {
                        setTimeout(function() {
                            throw o
                        }, 1)
                    }
                h && f.loop !== !0 && h(e),
                g(l) && f.loop === !0 && !b && (m.each(g(l).tweensContainer, function(a, b) {
                    /^rotate/.test(a) && 360 === parseFloat(b.endValue) && (b.endValue = 0,
                    b.startValue = 360),
                    /^backgroundPosition/.test(a) && 100 === parseFloat(b.endValue) && "%" === b.unitType && (b.endValue = 0,
                    b.startValue = 100)
                }),
                t(l, "reverse", {
                    loop: !0,
                    delay: f.delay
                })),
                f.queue !== !1 && m.dequeue(l, f.queue)
            }
            t.State.calls[a] = !1;
            for (var p = 0, q = t.State.calls.length; q > p; p++)
                if (t.State.calls[p] !== !1) {
                    i = !0;
                    break
                }
            i === !1 && (t.State.isTicking = !1,
            delete t.State.calls,
            t.State.calls = [])
        }
        var m, n = function() {
            if (c.documentMode)
                return c.documentMode;
            for (var a = 7; a > 4; a--) {
                var b = c.createElement("div");
                if (b.innerHTML = "<!--[if IE " + a + "]><span></span><![endif]-->",
                b.getElementsByTagName("span").length)
                    return b = null,
                    a
            }
            return d
        }(), o = function() {
            var a = 0;
            return b.webkitRequestAnimationFrame || b.mozRequestAnimationFrame || function(b) {
                var c, d = (new Date).getTime();
                return c = Math.max(0, 16 - (d - a)),
                a = d + c,
                setTimeout(function() {
                    b(d + c)
                }, c)
            }
        }(), p = {
            isString: function(a) {
                return "string" == typeof a
            },
            isArray: Array.isArray || function(a) {
                return "[object Array]" === Object.prototype.toString.call(a)
            }
            ,
            isFunction: function(a) {
                return "[object Function]" === Object.prototype.toString.call(a)
            },
            isNode: function(a) {
                return a && a.nodeType
            },
            isNodeList: function(a) {
                return "object" == typeof a && /^\[object (HTMLCollection|NodeList|Object)\]$/.test(Object.prototype.toString.call(a)) && a.length !== d && (0 === a.length || "object" == typeof a[0] && a[0].nodeType > 0)
            },
            isWrapped: function(a) {
                return a && (a.jquery || b.Zepto && b.Zepto.zepto.isZ(a))
            },
            isSVG: function(a) {
                return b.SVGElement && a instanceof b.SVGElement
            },
            isEmptyObject: function(a) {
                for (var b in a)
                    return !1;
                return !0
            }
        }, q = !1;
        if (a.fn && a.fn.jquery ? (m = a,
        q = !0) : m = b.Velocity.Utilities,
        8 >= n && !q)
            throw new Error("Velocity: IE8 and below require jQuery to be loaded before Velocity.");
        if (7 >= n)
            return void (jQuery.fn.velocity = jQuery.fn.animate);
        var r = 400
          , s = "swing"
          , t = {
            State: {
                isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
                isAndroid: /Android/i.test(navigator.userAgent),
                isGingerbread: /Android 2\.3\.[3-7]/i.test(navigator.userAgent),
                isChrome: b.chrome,
                isFirefox: /Firefox/i.test(navigator.userAgent),
                prefixElement: c.createElement("div"),
                prefixMatches: {},
                scrollAnchor: null,
                scrollPropertyLeft: null,
                scrollPropertyTop: null,
                isTicking: !1,
                calls: []
            },
            CSS: {},
            Utilities: m,
            Redirects: {},
            Easings: {},
            Promise: b.Promise,
            defaults: {
                queue: "",
                duration: r,
                easing: s,
                begin: d,
                complete: d,
                progress: d,
                display: d,
                visibility: d,
                loop: !1,
                delay: !1,
                mobileHA: !0,
                _cacheValues: !0
            },
            init: function(a) {
                m.data(a, "velocity", {
                    isSVG: p.isSVG(a),
                    isAnimating: !1,
                    computedStyle: null,
                    tweensContainer: null,
                    rootPropertyValueCache: {},
                    transformCache: {}
                })
            },
            hook: null,
            mock: !1,
            version: {
                major: 1,
                minor: 2,
                patch: 2
            },
            debug: !1
        };
        b.pageYOffset !== d ? (t.State.scrollAnchor = b,
        t.State.scrollPropertyLeft = "pageXOffset",
        t.State.scrollPropertyTop = "pageYOffset") : (t.State.scrollAnchor = c.documentElement || c.body.parentNode || c.body,
        t.State.scrollPropertyLeft = "scrollLeft",
        t.State.scrollPropertyTop = "scrollTop");
        var u = function() {
            function a(a) {
                return -a.tension * a.x - a.friction * a.v
            }
            function b(b, c, d) {
                var e = {
                    x: b.x + d.dx * c,
                    v: b.v + d.dv * c,
                    tension: b.tension,
                    friction: b.friction
                };
                return {
                    dx: e.v,
                    dv: a(e)
                }
            }
            function c(c, d) {
                var e = {
                    dx: c.v,
                    dv: a(c)
                }
                  , f = b(c, .5 * d, e)
                  , g = b(c, .5 * d, f)
                  , h = b(c, d, g)
                  , i = 1 / 6 * (e.dx + 2 * (f.dx + g.dx) + h.dx)
                  , j = 1 / 6 * (e.dv + 2 * (f.dv + g.dv) + h.dv);
                return c.x = c.x + i * d,
                c.v = c.v + j * d,
                c
            }
            return function d(a, b, e) {
                var f, g, h, i = {
                    x: -1,
                    v: 0,
                    tension: null,
                    friction: null
                }, j = [0], k = 0, l = 1e-4, m = .016;
                for (a = parseFloat(a) || 500,
                b = parseFloat(b) || 20,
                e = e || null,
                i.tension = a,
                i.friction = b,
                f = null !== e,
                f ? (k = d(a, b),
                g = k / e * m) : g = m; h = c(h || i, g),
                j.push(1 + h.x),
                k += 16,
                Math.abs(h.x) > l && Math.abs(h.v) > l; )
                    ;
                return f ? function(a) {
                    return j[a * (j.length - 1) | 0]
                }
                : k
            }
        }();
        t.Easings = {
            linear: function(a) {
                return a
            },
            swing: function(a) {
                return .5 - Math.cos(a * Math.PI) / 2
            },
            spring: function(a) {
                return 1 - Math.cos(4.5 * a * Math.PI) * Math.exp(6 * -a)
            }
        },
        m.each([["ease", [.25, .1, .25, 1]], ["ease-in", [.42, 0, 1, 1]], ["ease-out", [0, 0, .58, 1]], ["ease-in-out", [.42, 0, .58, 1]], ["easeInSine", [.47, 0, .745, .715]], ["easeOutSine", [.39, .575, .565, 1]], ["easeInOutSine", [.445, .05, .55, .95]], ["easeInQuad", [.55, .085, .68, .53]], ["easeOutQuad", [.25, .46, .45, .94]], ["easeInOutQuad", [.455, .03, .515, .955]], ["easeInCubic", [.55, .055, .675, .19]], ["easeOutCubic", [.215, .61, .355, 1]], ["easeInOutCubic", [.645, .045, .355, 1]], ["easeInQuart", [.895, .03, .685, .22]], ["easeOutQuart", [.165, .84, .44, 1]], ["easeInOutQuart", [.77, 0, .175, 1]], ["easeInQuint", [.755, .05, .855, .06]], ["easeOutQuint", [.23, 1, .32, 1]], ["easeInOutQuint", [.86, 0, .07, 1]], ["easeInExpo", [.95, .05, .795, .035]], ["easeOutExpo", [.19, 1, .22, 1]], ["easeInOutExpo", [1, 0, 0, 1]], ["easeInCirc", [.6, .04, .98, .335]], ["easeOutCirc", [.075, .82, .165, 1]], ["easeInOutCirc", [.785, .135, .15, .86]]], function(a, b) {
            t.Easings[b[0]] = i.apply(null, b[1])
        });
        var v = t.CSS = {
            RegEx: {
                isHex: /^#([A-f\d]{3}){1,2}$/i,
                valueUnwrap: /^[A-z]+\((.*)\)$/i,
                wrappedValueAlreadyExtracted: /[0-9.]+ [0-9.]+ [0-9.]+( [0-9.]+)?/,
                valueSplit: /([A-z]+\(.+\))|(([A-z0-9#-.]+?)(?=\s|$))/gi
            },
            Lists: {
                colors: ["fill", "stroke", "stopColor", "color", "backgroundColor", "borderColor", "borderTopColor", "borderRightColor", "borderBottomColor", "borderLeftColor", "outlineColor"],
                transformsBase: ["translateX", "translateY", "scale", "scaleX", "scaleY", "skewX", "skewY", "rotateZ"],
                transforms3D: ["transformPerspective", "translateZ", "scaleZ", "rotateX", "rotateY"]
            },
            Hooks: {
                templates: {
                    textShadow: ["Color X Y Blur", "black 0px 0px 0px"],
                    boxShadow: ["Color X Y Blur Spread", "black 0px 0px 0px 0px"],
                    clip: ["Top Right Bottom Left", "0px 0px 0px 0px"],
                    backgroundPosition: ["X Y", "0% 0%"],
                    transformOrigin: ["X Y Z", "50% 50% 0px"],
                    perspectiveOrigin: ["X Y", "50% 50%"]
                },
                registered: {},
                register: function() {
                    for (var a = 0; a < v.Lists.colors.length; a++) {
                        var b = "color" === v.Lists.colors[a] ? "0 0 0 1" : "255 255 255 1";
                        v.Hooks.templates[v.Lists.colors[a]] = ["Red Green Blue Alpha", b]
                    }
                    var c, d, e;
                    if (n)
                        for (c in v.Hooks.templates) {
                            d = v.Hooks.templates[c],
                            e = d[0].split(" ");
                            var f = d[1].match(v.RegEx.valueSplit);
                            "Color" === e[0] && (e.push(e.shift()),
                            f.push(f.shift()),
                            v.Hooks.templates[c] = [e.join(" "), f.join(" ")])
                        }
                    for (c in v.Hooks.templates) {
                        d = v.Hooks.templates[c],
                        e = d[0].split(" ");
                        for (var a in e) {
                            var g = c + e[a]
                              , h = a;
                            v.Hooks.registered[g] = [c, h]
                        }
                    }
                },
                getRoot: function(a) {
                    var b = v.Hooks.registered[a];
                    return b ? b[0] : a
                },
                cleanRootPropertyValue: function(a, b) {
                    return v.RegEx.valueUnwrap.test(b) && (b = b.match(v.RegEx.valueUnwrap)[1]),
                    v.Values.isCSSNullValue(b) && (b = v.Hooks.templates[a][1]),
                    b
                },
                extractValue: function(a, b) {
                    var c = v.Hooks.registered[a];
                    if (c) {
                        var d = c[0]
                          , e = c[1];
                        return b = v.Hooks.cleanRootPropertyValue(d, b),
                        b.toString().match(v.RegEx.valueSplit)[e]
                    }
                    return b
                },
                injectValue: function(a, b, c) {
                    var d = v.Hooks.registered[a];
                    if (d) {
                        var e, f, g = d[0], h = d[1];
                        return c = v.Hooks.cleanRootPropertyValue(g, c),
                        e = c.toString().match(v.RegEx.valueSplit),
                        e[h] = b,
                        f = e.join(" ")
                    }
                    return c
                }
            },
            Normalizations: {
                registered: {
                    clip: function(a, b, c) {
                        switch (a) {
                        case "name":
                            return "clip";
                        case "extract":
                            var d;
                            return v.RegEx.wrappedValueAlreadyExtracted.test(c) ? d = c : (d = c.toString().match(v.RegEx.valueUnwrap),
                            d = d ? d[1].replace(/,(\s+)?/g, " ") : c),
                            d;
                        case "inject":
                            return "rect(" + c + ")"
                        }
                    },
                    blur: function(a, b, c) {
                        switch (a) {
                        case "name":
                            return t.State.isFirefox ? "filter" : "-webkit-filter";
                        case "extract":
                            var d = parseFloat(c);
                            if (!d && 0 !== d) {
                                var e = c.toString().match(/blur\(([0-9]+[A-z]+)\)/i);
                                d = e ? e[1] : 0
                            }
                            return d;
                        case "inject":
                            return parseFloat(c) ? "blur(" + c + ")" : "none"
                        }
                    },
                    opacity: function(a, b, c) {
                        if (8 >= n)
                            switch (a) {
                            case "name":
                                return "filter";
                            case "extract":
                                var d = c.toString().match(/alpha\(opacity=(.*)\)/i);
                                return c = d ? d[1] / 100 : 1;
                            case "inject":
                                return b.style.zoom = 1,
                                parseFloat(c) >= 1 ? "" : "alpha(opacity=" + parseInt(100 * parseFloat(c), 10) + ")"
                            }
                        else
                            switch (a) {
                            case "name":
                                return "opacity";
                            case "extract":
                                return c;
                            case "inject":
                                return c
                            }
                    }
                },
                register: function() {
                    9 >= n || t.State.isGingerbread || (v.Lists.transformsBase = v.Lists.transformsBase.concat(v.Lists.transforms3D));
                    for (var a = 0; a < v.Lists.transformsBase.length; a++)
                        !function() {
                            var b = v.Lists.transformsBase[a];
                            v.Normalizations.registered[b] = function(a, c, e) {
                                switch (a) {
                                case "name":
                                    return "transform";
                                case "extract":
                                    return g(c) === d || g(c).transformCache[b] === d ? /^scale/i.test(b) ? 1 : 0 : g(c).transformCache[b].replace(/[()]/g, "");
                                case "inject":
                                    var f = !1;
                                    switch (b.substr(0, b.length - 1)) {
                                    case "translate":
                                        f = !/(%|px|em|rem|vw|vh|\d)$/i.test(e);
                                        break;
                                    case "scal":
                                    case "scale":
                                        t.State.isAndroid && g(c).transformCache[b] === d && 1 > e && (e = 1),
                                        f = !/(\d)$/i.test(e);
                                        break;
                                    case "skew":
                                        f = !/(deg|\d)$/i.test(e);
                                        break;
                                    case "rotate":
                                        f = !/(deg|\d)$/i.test(e)
                                    }
                                    return f || (g(c).transformCache[b] = "(" + e + ")"),
                                    g(c).transformCache[b]
                                }
                            }
                        }();
                    for (var a = 0; a < v.Lists.colors.length; a++)
                        !function() {
                            var b = v.Lists.colors[a];
                            v.Normalizations.registered[b] = function(a, c, e) {
                                switch (a) {
                                case "name":
                                    return b;
                                case "extract":
                                    var f;
                                    if (v.RegEx.wrappedValueAlreadyExtracted.test(e))
                                        f = e;
                                    else {
                                        var g, h = {
                                            black: "rgb(0, 0, 0)",
                                            blue: "rgb(0, 0, 255)",
                                            gray: "rgb(128, 128, 128)",
                                            green: "rgb(0, 128, 0)",
                                            red: "rgb(255, 0, 0)",
                                            white: "rgb(255, 255, 255)"
                                        };
                                        /^[A-z]+$/i.test(e) ? g = h[e] !== d ? h[e] : h.black : v.RegEx.isHex.test(e) ? g = "rgb(" + v.Values.hexToRgb(e).join(" ") + ")" : /^rgba?\(/i.test(e) || (g = h.black),
                                        f = (g || e).toString().match(v.RegEx.valueUnwrap)[1].replace(/,(\s+)?/g, " ")
                                    }
                                    return 8 >= n || 3 !== f.split(" ").length || (f += " 1"),
                                    f;
                                case "inject":
                                    return 8 >= n ? 4 === e.split(" ").length && (e = e.split(/\s+/).slice(0, 3).join(" ")) : 3 === e.split(" ").length && (e += " 1"),
                                    (8 >= n ? "rgb" : "rgba") + "(" + e.replace(/\s+/g, ",").replace(/\.(\d)+(?=,)/g, "") + ")"
                                }
                            }
                        }()
                }
            },
            Names: {
                camelCase: function(a) {
                    return a.replace(/-(\w)/g, function(a, b) {
                        return b.toUpperCase()
                    })
                },
                SVGAttribute: function(a) {
                    var b = "width|height|x|y|cx|cy|r|rx|ry|x1|x2|y1|y2";
                    return (n || t.State.isAndroid && !t.State.isChrome) && (b += "|transform"),
                    new RegExp("^(" + b + ")$","i").test(a)
                },
                prefixCheck: function(a) {
                    if (t.State.prefixMatches[a])
                        return [t.State.prefixMatches[a], !0];
                    for (var b = ["", "Webkit", "Moz", "ms", "O"], c = 0, d = b.length; d > c; c++) {
                        var e;
                        if (e = 0 === c ? a : b[c] + a.replace(/^\w/, function(a) {
                            return a.toUpperCase()
                        }),
                        p.isString(t.State.prefixElement.style[e]))
                            return t.State.prefixMatches[a] = e,
                            [e, !0]
                    }
                    return [a, !1]
                }
            },
            Values: {
                hexToRgb: function(a) {
                    var b, c = /^#?([a-f\d])([a-f\d])([a-f\d])$/i, d = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
                    return a = a.replace(c, function(a, b, c, d) {
                        return b + b + c + c + d + d
                    }),
                    b = d.exec(a),
                    b ? [parseInt(b[1], 16), parseInt(b[2], 16), parseInt(b[3], 16)] : [0, 0, 0]
                },
                isCSSNullValue: function(a) {
                    return 0 == a || /^(none|auto|transparent|(rgba\(0, ?0, ?0, ?0\)))$/i.test(a)
                },
                getUnitType: function(a) {
                    return /^(rotate|skew)/i.test(a) ? "deg" : /(^(scale|scaleX|scaleY|scaleZ|alpha|flexGrow|flexHeight|zIndex|fontWeight)$)|((opacity|red|green|blue|alpha)$)/i.test(a) ? "" : "px"
                },
                getDisplayType: function(a) {
                    var b = a && a.tagName.toString().toLowerCase();
                    return /^(b|big|i|small|tt|abbr|acronym|cite|code|dfn|em|kbd|strong|samp|var|a|bdo|br|img|map|object|q|script|span|sub|sup|button|input|label|select|textarea)$/i.test(b) ? "inline" : /^(li)$/i.test(b) ? "list-item" : /^(tr)$/i.test(b) ? "table-row" : /^(table)$/i.test(b) ? "table" : /^(tbody)$/i.test(b) ? "table-row-group" : "block"
                },
                addClass: function(a, b) {
                    a.classList ? a.classList.add(b) : a.className += (a.className.length ? " " : "") + b
                },
                removeClass: function(a, b) {
                    a.classList ? a.classList.remove(b) : a.className = a.className.toString().replace(new RegExp("(^|\\s)" + b.split(" ").join("|") + "(\\s|$)","gi"), " ")
                }
            },
            getPropertyValue: function(a, c, e, f) {
                function h(a, c) {
                    function e() {
                        j && v.setPropertyValue(a, "display", "none")
                    }
                    var i = 0;
                    if (8 >= n)
                        i = m.css(a, c);
                    else {
                        var j = !1;
                        if (/^(width|height)$/.test(c) && 0 === v.getPropertyValue(a, "display") && (j = !0,
                        v.setPropertyValue(a, "display", v.Values.getDisplayType(a))),
                        !f) {
                            if ("height" === c && "border-box" !== v.getPropertyValue(a, "boxSizing").toString().toLowerCase()) {
                                var k = a.offsetHeight - (parseFloat(v.getPropertyValue(a, "borderTopWidth")) || 0) - (parseFloat(v.getPropertyValue(a, "borderBottomWidth")) || 0) - (parseFloat(v.getPropertyValue(a, "paddingTop")) || 0) - (parseFloat(v.getPropertyValue(a, "paddingBottom")) || 0);
                                return e(),
                                k
                            }
                            if ("width" === c && "border-box" !== v.getPropertyValue(a, "boxSizing").toString().toLowerCase()) {
                                var l = a.offsetWidth - (parseFloat(v.getPropertyValue(a, "borderLeftWidth")) || 0) - (parseFloat(v.getPropertyValue(a, "borderRightWidth")) || 0) - (parseFloat(v.getPropertyValue(a, "paddingLeft")) || 0) - (parseFloat(v.getPropertyValue(a, "paddingRight")) || 0);
                                return e(),
                                l
                            }
                        }
                        var o;
                        o = g(a) === d ? b.getComputedStyle(a, null) : g(a).computedStyle ? g(a).computedStyle : g(a).computedStyle = b.getComputedStyle(a, null),
                        "borderColor" === c && (c = "borderTopColor"),
                        i = 9 === n && "filter" === c ? o.getPropertyValue(c) : o[c],
                        ("" === i || null === i) && (i = a.style[c]),
                        e()
                    }
                    if ("auto" === i && /^(top|right|bottom|left)$/i.test(c)) {
                        var p = h(a, "position");
                        ("fixed" === p || "absolute" === p && /top|left/i.test(c)) && (i = m(a).position()[c] + "px")
                    }
                    return i
                }
                var i;
                if (v.Hooks.registered[c]) {
                    var j = c
                      , k = v.Hooks.getRoot(j);
                    e === d && (e = v.getPropertyValue(a, v.Names.prefixCheck(k)[0])),
                    v.Normalizations.registered[k] && (e = v.Normalizations.registered[k]("extract", a, e)),
                    i = v.Hooks.extractValue(j, e)
                } else if (v.Normalizations.registered[c]) {
                    var l, o;
                    l = v.Normalizations.registered[c]("name", a),
                    "transform" !== l && (o = h(a, v.Names.prefixCheck(l)[0]),
                    v.Values.isCSSNullValue(o) && v.Hooks.templates[c] && (o = v.Hooks.templates[c][1])),
                    i = v.Normalizations.registered[c]("extract", a, o)
                }
                if (!/^[\d-]/.test(i))
                    if (g(a) && g(a).isSVG && v.Names.SVGAttribute(c))
                        if (/^(height|width)$/i.test(c))
                            try {
                                i = a.getBBox()[c]
                            } catch (p) {
                                i = 0
                            }
                        else
                            i = a.getAttribute(c);
                    else
                        i = h(a, v.Names.prefixCheck(c)[0]);
                return v.Values.isCSSNullValue(i) && (i = 0),
                t.debug >= 2 && console.log("Get " + c + ": " + i),
                i
            },
            setPropertyValue: function(a, c, d, e, f) {
                var h = c;
                if ("scroll" === c)
                    f.container ? f.container["scroll" + f.direction] = d : "Left" === f.direction ? b.scrollTo(d, f.alternateValue) : b.scrollTo(f.alternateValue, d);
                else if (v.Normalizations.registered[c] && "transform" === v.Normalizations.registered[c]("name", a))
                    v.Normalizations.registered[c]("inject", a, d),
                    h = "transform",
                    d = g(a).transformCache[c];
                else {
                    if (v.Hooks.registered[c]) {
                        var i = c
                          , j = v.Hooks.getRoot(c);
                        e = e || v.getPropertyValue(a, j),
                        d = v.Hooks.injectValue(i, d, e),
                        c = j
                    }
                    if (v.Normalizations.registered[c] && (d = v.Normalizations.registered[c]("inject", a, d),
                    c = v.Normalizations.registered[c]("name", a)),
                    h = v.Names.prefixCheck(c)[0],
                    8 >= n)
                        try {
                            a.style[h] = d
                        } catch (k) {
                            t.debug && console.log("Browser does not support [" + d + "] for [" + h + "]")
                        }
                    else
                        g(a) && g(a).isSVG && v.Names.SVGAttribute(c) ? a.setAttribute(c, d) : a.style[h] = d;
                    t.debug >= 2 && console.log("Set " + c + " (" + h + "): " + d)
                }
                return [h, d]
            },
            flushTransformCache: function(a) {
                function b(b) {
                    return parseFloat(v.getPropertyValue(a, b))
                }
                var c = "";
                if ((n || t.State.isAndroid && !t.State.isChrome) && g(a).isSVG) {
                    var d = {
                        translate: [b("translateX"), b("translateY")],
                        skewX: [b("skewX")],
                        skewY: [b("skewY")],
                        scale: 1 !== b("scale") ? [b("scale"), b("scale")] : [b("scaleX"), b("scaleY")],
                        rotate: [b("rotateZ"), 0, 0]
                    };
                    m.each(g(a).transformCache, function(a) {
                        /^translate/i.test(a) ? a = "translate" : /^scale/i.test(a) ? a = "scale" : /^rotate/i.test(a) && (a = "rotate"),
                        d[a] && (c += a + "(" + d[a].join(" ") + ") ",
                        delete d[a])
                    })
                } else {
                    var e, f;
                    m.each(g(a).transformCache, function(b) {
                        return e = g(a).transformCache[b],
                        "transformPerspective" === b ? (f = e,
                        !0) : (9 === n && "rotateZ" === b && (b = "rotate"),
                        void (c += b + e + " "))
                    }),
                    f && (c = "perspective" + f + " " + c)
                }
                v.setPropertyValue(a, "transform", c)
            }
        };
        v.Hooks.register(),
        v.Normalizations.register(),
        t.hook = function(a, b, c) {
            var e = d;
            return a = f(a),
            m.each(a, function(a, f) {
                if (g(f) === d && t.init(f),
                c === d)
                    e === d && (e = t.CSS.getPropertyValue(f, b));
                else {
                    var h = t.CSS.setPropertyValue(f, b, c);
                    "transform" === h[0] && t.CSS.flushTransformCache(f),
                    e = h
                }
            }),
            e
        }
        ;
        var w = function() {
            function a() {
                return h ? B.promise || null : i
            }
            function e() {
                function a(a) {
                    function l(a, b) {
                        var c = d
                          , e = d
                          , g = d;
                        return p.isArray(a) ? (c = a[0],
                        !p.isArray(a[1]) && /^[\d-]/.test(a[1]) || p.isFunction(a[1]) || v.RegEx.isHex.test(a[1]) ? g = a[1] : (p.isString(a[1]) && !v.RegEx.isHex.test(a[1]) || p.isArray(a[1])) && (e = b ? a[1] : j(a[1], h.duration),
                        a[2] !== d && (g = a[2]))) : c = a,
                        b || (e = e || h.easing),
                        p.isFunction(c) && (c = c.call(f, y, x)),
                        p.isFunction(g) && (g = g.call(f, y, x)),
                        [c || 0, e, g]
                    }
                    function n(a, b) {
                        var c, d;
                        return d = (b || "0").toString().toLowerCase().replace(/[%A-z]+$/, function(a) {
                            return c = a,
                            ""
                        }),
                        c || (c = v.Values.getUnitType(a)),
                        [d, c]
                    }
                    function r() {
                        var a = {
                            myParent: f.parentNode || c.body,
                            position: v.getPropertyValue(f, "position"),
                            fontSize: v.getPropertyValue(f, "fontSize")
                        }
                          , d = a.position === I.lastPosition && a.myParent === I.lastParent
                          , e = a.fontSize === I.lastFontSize;
                        I.lastParent = a.myParent,
                        I.lastPosition = a.position,
                        I.lastFontSize = a.fontSize;
                        var h = 100
                          , i = {};
                        if (e && d)
                            i.emToPx = I.lastEmToPx,
                            i.percentToPxWidth = I.lastPercentToPxWidth,
                            i.percentToPxHeight = I.lastPercentToPxHeight;
                        else {
                            var j = g(f).isSVG ? c.createElementNS("http://www.w3.org/2000/svg", "rect") : c.createElement("div");
                            t.init(j),
                            a.myParent.appendChild(j),
                            m.each(["overflow", "overflowX", "overflowY"], function(a, b) {
                                t.CSS.setPropertyValue(j, b, "hidden")
                            }),
                            t.CSS.setPropertyValue(j, "position", a.position),
                            t.CSS.setPropertyValue(j, "fontSize", a.fontSize),
                            t.CSS.setPropertyValue(j, "boxSizing", "content-box"),
                            m.each(["minWidth", "maxWidth", "width", "minHeight", "maxHeight", "height"], function(a, b) {
                                t.CSS.setPropertyValue(j, b, h + "%")
                            }),
                            t.CSS.setPropertyValue(j, "paddingLeft", h + "em"),
                            i.percentToPxWidth = I.lastPercentToPxWidth = (parseFloat(v.getPropertyValue(j, "width", null, !0)) || 1) / h,
                            i.percentToPxHeight = I.lastPercentToPxHeight = (parseFloat(v.getPropertyValue(j, "height", null, !0)) || 1) / h,
                            i.emToPx = I.lastEmToPx = (parseFloat(v.getPropertyValue(j, "paddingLeft")) || 1) / h,
                            a.myParent.removeChild(j)
                        }
                        return null === I.remToPx && (I.remToPx = parseFloat(v.getPropertyValue(c.body, "fontSize")) || 16),
                        null === I.vwToPx && (I.vwToPx = parseFloat(b.innerWidth) / 100,
                        I.vhToPx = parseFloat(b.innerHeight) / 100),
                        i.remToPx = I.remToPx,
                        i.vwToPx = I.vwToPx,
                        i.vhToPx = I.vhToPx,
                        t.debug >= 1 && console.log("Unit ratios: " + JSON.stringify(i), f),
                        i
                    }
                    if (h.begin && 0 === y)
                        try {
                            h.begin.call(o, o)
                        } catch (u) {
                            setTimeout(function() {
                                throw u
                            }, 1)
                        }
                    if ("scroll" === C) {
                        var w, z, A, D = /^x$/i.test(h.axis) ? "Left" : "Top", E = parseFloat(h.offset) || 0;
                        h.container ? p.isWrapped(h.container) || p.isNode(h.container) ? (h.container = h.container[0] || h.container,
                        w = h.container["scroll" + D],
                        A = w + m(f).position()[D.toLowerCase()] + E) : h.container = null : (w = t.State.scrollAnchor[t.State["scrollProperty" + D]],
                        z = t.State.scrollAnchor[t.State["scrollProperty" + ("Left" === D ? "Top" : "Left")]],
                        A = m(f).offset()[D.toLowerCase()] + E),
                        i = {
                            scroll: {
                                rootPropertyValue: !1,
                                startValue: w,
                                currentValue: w,
                                endValue: A,
                                unitType: "",
                                easing: h.easing,
                                scrollData: {
                                    container: h.container,
                                    direction: D,
                                    alternateValue: z
                                }
                            },
                            element: f
                        },
                        t.debug && console.log("tweensContainer (scroll): ", i.scroll, f)
                    } else if ("reverse" === C) {
                        if (!g(f).tweensContainer)
                            return void m.dequeue(f, h.queue);
                        "none" === g(f).opts.display && (g(f).opts.display = "auto"),
                        "hidden" === g(f).opts.visibility && (g(f).opts.visibility = "visible"),
                        g(f).opts.loop = !1,
                        g(f).opts.begin = null,
                        g(f).opts.complete = null,
                        s.easing || delete h.easing,
                        s.duration || delete h.duration,
                        h = m.extend({}, g(f).opts, h);
                        var F = m.extend(!0, {}, g(f).tweensContainer);
                        for (var G in F)
                            if ("element" !== G) {
                                var H = F[G].startValue;
                                F[G].startValue = F[G].currentValue = F[G].endValue,
                                F[G].endValue = H,
                                p.isEmptyObject(s) || (F[G].easing = h.easing),
                                t.debug && console.log("reverse tweensContainer (" + G + "): " + JSON.stringify(F[G]), f)
                            }
                        i = F
                    } else if ("start" === C) {
                        var F;
                        g(f).tweensContainer && g(f).isAnimating === !0 && (F = g(f).tweensContainer),
                        m.each(q, function(a, b) {
                            if (RegExp("^" + v.Lists.colors.join("$|^") + "$").test(a)) {
                                var c = l(b, !0)
                                  , e = c[0]
                                  , f = c[1]
                                  , g = c[2];
                                if (v.RegEx.isHex.test(e)) {
                                    for (var h = ["Red", "Green", "Blue"], i = v.Values.hexToRgb(e), j = g ? v.Values.hexToRgb(g) : d, k = 0; k < h.length; k++) {
                                        var m = [i[k]];
                                        f && m.push(f),
                                        j !== d && m.push(j[k]),
                                        q[a + h[k]] = m
                                    }
                                    delete q[a]
                                }
                            }
                        });
                        for (var K in q) {
                            var L = l(q[K])
                              , M = L[0]
                              , N = L[1]
                              , O = L[2];
                            K = v.Names.camelCase(K);
                            var P = v.Hooks.getRoot(K)
                              , Q = !1;
                            if (g(f).isSVG || "tween" === P || v.Names.prefixCheck(P)[1] !== !1 || v.Normalizations.registered[P] !== d) {
                                (h.display !== d && null !== h.display && "none" !== h.display || h.visibility !== d && "hidden" !== h.visibility) && /opacity|filter/.test(K) && !O && 0 !== M && (O = 0),
                                h._cacheValues && F && F[K] ? (O === d && (O = F[K].endValue + F[K].unitType),
                                Q = g(f).rootPropertyValueCache[P]) : v.Hooks.registered[K] ? O === d ? (Q = v.getPropertyValue(f, P),
                                O = v.getPropertyValue(f, K, Q)) : Q = v.Hooks.templates[P][1] : O === d && (O = v.getPropertyValue(f, K));
                                var R, S, T, U = !1;
                                if (R = n(K, O),
                                O = R[0],
                                T = R[1],
                                R = n(K, M),
                                M = R[0].replace(/^([+-\/*])=/, function(a, b) {
                                    return U = b,
                                    ""
                                }),
                                S = R[1],
                                O = parseFloat(O) || 0,
                                M = parseFloat(M) || 0,
                                "%" === S && (/^(fontSize|lineHeight)$/.test(K) ? (M /= 100,
                                S = "em") : /^scale/.test(K) ? (M /= 100,
                                S = "") : /(Red|Green|Blue)$/i.test(K) && (M = M / 100 * 255,
                                S = "")),
                                /[\/*]/.test(U))
                                    S = T;
                                else if (T !== S && 0 !== O)
                                    if (0 === M)
                                        S = T;
                                    else {
                                        e = e || r();
                                        var V = /margin|padding|left|right|width|text|word|letter/i.test(K) || /X$/.test(K) || "x" === K ? "x" : "y";
                                        switch (T) {
                                        case "%":
                                            O *= "x" === V ? e.percentToPxWidth : e.percentToPxHeight;
                                            break;
                                        case "px":
                                            break;
                                        default:
                                            O *= e[T + "ToPx"]
                                        }
                                        switch (S) {
                                        case "%":
                                            O *= 1 / ("x" === V ? e.percentToPxWidth : e.percentToPxHeight);
                                            break;
                                        case "px":
                                            break;
                                        default:
                                            O *= 1 / e[S + "ToPx"]
                                        }
                                    }
                                switch (U) {
                                case "+":
                                    M = O + M;
                                    break;
                                case "-":
                                    M = O - M;
                                    break;
                                case "*":
                                    M = O * M;
                                    break;
                                case "/":
                                    M = O / M
                                }
                                i[K] = {
                                    rootPropertyValue: Q,
                                    startValue: O,
                                    currentValue: O,
                                    endValue: M,
                                    unitType: S,
                                    easing: N
                                },
                                t.debug && console.log("tweensContainer (" + K + "): " + JSON.stringify(i[K]), f)
                            } else
                                t.debug && console.log("Skipping [" + P + "] due to a lack of browser support.")
                        }
                        i.element = f
                    }
                    i.element && (v.Values.addClass(f, "velocity-animating"),
                    J.push(i),
                    "" === h.queue && (g(f).tweensContainer = i,
                    g(f).opts = h),
                    g(f).isAnimating = !0,
                    y === x - 1 ? (t.State.calls.push([J, o, h, null, B.resolver]),
                    t.State.isTicking === !1 && (t.State.isTicking = !0,
                    k())) : y++)
                }
                var e, f = this, h = m.extend({}, t.defaults, s), i = {};
                switch (g(f) === d && t.init(f),
                parseFloat(h.delay) && h.queue !== !1 && m.queue(f, h.queue, function(a) {
                    t.velocityQueueEntryFlag = !0,
                    g(f).delayTimer = {
                        setTimeout: setTimeout(a, parseFloat(h.delay)),
                        next: a
                    }
                }),
                h.duration.toString().toLowerCase()) {
                case "fast":
                    h.duration = 200;
                    break;
                case "normal":
                    h.duration = r;
                    break;
                case "slow":
                    h.duration = 600;
                    break;
                default:
                    h.duration = parseFloat(h.duration) || 1
                }
                t.mock !== !1 && (t.mock === !0 ? h.duration = h.delay = 1 : (h.duration *= parseFloat(t.mock) || 1,
                h.delay *= parseFloat(t.mock) || 1)),
                h.easing = j(h.easing, h.duration),
                h.begin && !p.isFunction(h.begin) && (h.begin = null),
                h.progress && !p.isFunction(h.progress) && (h.progress = null),
                h.complete && !p.isFunction(h.complete) && (h.complete = null),
                h.display !== d && null !== h.display && (h.display = h.display.toString().toLowerCase(),
                "auto" === h.display && (h.display = t.CSS.Values.getDisplayType(f))),
                h.visibility !== d && null !== h.visibility && (h.visibility = h.visibility.toString().toLowerCase()),
                h.mobileHA = h.mobileHA && t.State.isMobile && !t.State.isGingerbread,
                h.queue === !1 ? h.delay ? setTimeout(a, h.delay) : a() : m.queue(f, h.queue, function(b, c) {
                    return c === !0 ? (B.promise && B.resolver(o),
                    !0) : (t.velocityQueueEntryFlag = !0,
                    void a(b))
                }),
                "" !== h.queue && "fx" !== h.queue || "inprogress" === m.queue(f)[0] || m.dequeue(f)
            }
            var h, i, n, o, q, s, u = arguments[0] && (arguments[0].p || m.isPlainObject(arguments[0].properties) && !arguments[0].properties.names || p.isString(arguments[0].properties));
            if (p.isWrapped(this) ? (h = !1,
            n = 0,
            o = this,
            i = this) : (h = !0,
            n = 1,
            o = u ? arguments[0].elements || arguments[0].e : arguments[0]),
            o = f(o)) {
                u ? (q = arguments[0].properties || arguments[0].p,
                s = arguments[0].options || arguments[0].o) : (q = arguments[n],
                s = arguments[n + 1]);
                var x = o.length
                  , y = 0;
                if (!/^(stop|finish)$/i.test(q) && !m.isPlainObject(s)) {
                    var z = n + 1;
                    s = {};
                    for (var A = z; A < arguments.length; A++)
                        p.isArray(arguments[A]) || !/^(fast|normal|slow)$/i.test(arguments[A]) && !/^\d/.test(arguments[A]) ? p.isString(arguments[A]) || p.isArray(arguments[A]) ? s.easing = arguments[A] : p.isFunction(arguments[A]) && (s.complete = arguments[A]) : s.duration = arguments[A]
                }
                var B = {
                    promise: null,
                    resolver: null,
                    rejecter: null
                };
                h && t.Promise && (B.promise = new t.Promise(function(a, b) {
                    B.resolver = a,
                    B.rejecter = b
                }
                ));
                var C;
                switch (q) {
                case "scroll":
                    C = "scroll";
                    break;
                case "reverse":
                    C = "reverse";
                    break;
                case "finish":
                case "stop":
                    m.each(o, function(a, b) {
                        g(b) && g(b).delayTimer && (clearTimeout(g(b).delayTimer.setTimeout),
                        g(b).delayTimer.next && g(b).delayTimer.next(),
                        delete g(b).delayTimer)
                    });
                    var D = [];
                    return m.each(t.State.calls, function(a, b) {
                        b && m.each(b[1], function(c, e) {
                            var f = s === d ? "" : s;
                            return f === !0 || b[2].queue === f || s === d && b[2].queue === !1 ? void m.each(o, function(c, d) {
                                d === e && ((s === !0 || p.isString(s)) && (m.each(m.queue(d, p.isString(s) ? s : ""), function(a, b) {
                                    p.isFunction(b) && b(null, !0)
                                }),
                                m.queue(d, p.isString(s) ? s : "", [])),
                                "stop" === q ? (g(d) && g(d).tweensContainer && f !== !1 && m.each(g(d).tweensContainer, function(a, b) {
                                    b.endValue = b.currentValue
                                }),
                                D.push(a)) : "finish" === q && (b[2].duration = 1))
                            }) : !0
                        })
                    }),
                    "stop" === q && (m.each(D, function(a, b) {
                        l(b, !0)
                    }),
                    B.promise && B.resolver(o)),
                    a();
                default:
                    if (!m.isPlainObject(q) || p.isEmptyObject(q)) {
                        if (p.isString(q) && t.Redirects[q]) {
                            var E = m.extend({}, s)
                              , F = E.duration
                              , G = E.delay || 0;
                            return E.backwards === !0 && (o = m.extend(!0, [], o).reverse()),
                            m.each(o, function(a, b) {
                                parseFloat(E.stagger) ? E.delay = G + parseFloat(E.stagger) * a : p.isFunction(E.stagger) && (E.delay = G + E.stagger.call(b, a, x)),
                                E.drag && (E.duration = parseFloat(F) || (/^(callout|transition)/.test(q) ? 1e3 : r),
                                E.duration = Math.max(E.duration * (E.backwards ? 1 - a / x : (a + 1) / x), .75 * E.duration, 200)),
                                t.Redirects[q].call(b, b, E || {}, a, x, o, B.promise ? B : d)
                            }),
                            a()
                        }
                        var H = "Velocity: First argument (" + q + ") was not a property map, a known action, or a registered redirect. Aborting.";
                        return B.promise ? B.rejecter(new Error(H)) : console.log(H),
                        a()
                    }
                    C = "start"
                }
                var I = {
                    lastParent: null,
                    lastPosition: null,
                    lastFontSize: null,
                    lastPercentToPxWidth: null,
                    lastPercentToPxHeight: null,
                    lastEmToPx: null,
                    remToPx: null,
                    vwToPx: null,
                    vhToPx: null
                }
                  , J = [];
                m.each(o, function(a, b) {
                    p.isNode(b) && e.call(b)
                });
                var K, E = m.extend({}, t.defaults, s);
                if (E.loop = parseInt(E.loop),
                K = 2 * E.loop - 1,
                E.loop)
                    for (var L = 0; K > L; L++) {
                        var M = {
                            delay: E.delay,
                            progress: E.progress
                        };
                        L === K - 1 && (M.display = E.display,
                        M.visibility = E.visibility,
                        M.complete = E.complete),
                        w(o, "reverse", M)
                    }
                return a()
            }
        };
        t = m.extend(w, t),
        t.animate = w;
        var x = b.requestAnimationFrame || o;
        return t.State.isMobile || c.hidden === d || c.addEventListener("visibilitychange", function() {
            c.hidden ? (x = function(a) {
                return setTimeout(function() {
                    a(!0)
                }, 16)
            }
            ,
            k()) : x = b.requestAnimationFrame || o
        }),
        a.Velocity = t,
        a !== b && (a.fn.velocity = w,
        a.fn.velocity.defaults = t.defaults),
        m.each(["Down", "Up"], function(a, b) {
            t.Redirects["slide" + b] = function(a, c, e, f, g, h) {
                var i = m.extend({}, c)
                  , j = i.begin
                  , k = i.complete
                  , l = {
                    height: "",
                    marginTop: "",
                    marginBottom: "",
                    paddingTop: "",
                    paddingBottom: ""
                }
                  , n = {};
                i.display === d && (i.display = "Down" === b ? "inline" === t.CSS.Values.getDisplayType(a) ? "inline-block" : "block" : "none"),
                i.begin = function() {
                    j && j.call(g, g);
                    for (var c in l) {
                        n[c] = a.style[c];
                        var d = t.CSS.getPropertyValue(a, c);
                        l[c] = "Down" === b ? [d, 0] : [0, d]
                    }
                    n.overflow = a.style.overflow,
                    a.style.overflow = "hidden"
                }
                ,
                i.complete = function() {
                    for (var b in n)
                        a.style[b] = n[b];
                    k && k.call(g, g),
                    h && h.resolver(g)
                }
                ,
                t(a, l, i)
            }
        }),
        m.each(["In", "Out"], function(a, b) {
            t.Redirects["fade" + b] = function(a, c, e, f, g, h) {
                var i = m.extend({}, c)
                  , j = {
                    opacity: "In" === b ? 1 : 0
                }
                  , k = i.complete;
                i.complete = e !== f - 1 ? i.begin = null : function() {
                    k && k.call(g, g),
                    h && h.resolver(g)
                }
                ,
                i.display === d && (i.display = "In" === b ? "auto" : "none"),
                t(this, j, i)
            }
        }),
        t
    }(window.jQuery || window.Zepto || window, window, document)
})),
!function(a, b, c, d) {
    "use strict";
    function e(a, b, c) {
        return setTimeout(k(a, c), b)
    }
    function f(a, b, c) {
        return Array.isArray(a) ? (g(a, c[b], c),
        !0) : !1
    }
    function g(a, b, c) {
        var e;
        if (a)
            if (a.forEach)
                a.forEach(b, c);
            else if (a.length !== d)
                for (e = 0; e < a.length; )
                    b.call(c, a[e], e, a),
                    e++;
            else
                for (e in a)
                    a.hasOwnProperty(e) && b.call(c, a[e], e, a)
    }
    function h(a, b, c) {
        for (var e = Object.keys(b), f = 0; f < e.length; )
            (!c || c && a[e[f]] === d) && (a[e[f]] = b[e[f]]),
            f++;
        return a
    }
    function i(a, b) {
        return h(a, b, !0)
    }
    function j(a, b, c) {
        var d, e = b.prototype;
        d = a.prototype = Object.create(e),
        d.constructor = a,
        d._super = e,
        c && h(d, c)
    }
    function k(a, b) {
        return function() {
            return a.apply(b, arguments)
        }
    }
    function l(a, b) {
        return typeof a == ka ? a.apply(b ? b[0] || d : d, b) : a
    }
    function m(a, b) {
        return a === d ? b : a
    }
    function n(a, b, c) {
        g(r(b), function(b) {
            a.addEventListener(b, c, !1)
        })
    }
    function o(a, b, c) {
        g(r(b), function(b) {
            a.removeEventListener(b, c, !1)
        })
    }
    function p(a, b) {
        for (; a; ) {
            if (a == b)
                return !0;
            a = a.parentNode
        }
        return !1
    }
    function q(a, b) {
        return a.indexOf(b) > -1
    }
    function r(a) {
        return a.trim().split(/\s+/g)
    }
    function s(a, b, c) {
        if (a.indexOf && !c)
            return a.indexOf(b);
        for (var d = 0; d < a.length; ) {
            if (c && a[d][c] == b || !c && a[d] === b)
                return d;
            d++
        }
        return -1
    }
    function t(a) {
        return Array.prototype.slice.call(a, 0)
    }
    function u(a, b, c) {
        for (var d = [], e = [], f = 0; f < a.length; ) {
            var g = b ? a[f][b] : a[f];
            s(e, g) < 0 && d.push(a[f]),
            e[f] = g,
            f++
        }
        return c && (d = b ? d.sort(function(a, c) {
            return a[b] > c[b]
        }) : d.sort()),
        d
    }
    function v(a, b) {
        for (var c, e, f = b[0].toUpperCase() + b.slice(1), g = 0; g < ia.length; ) {
            if (c = ia[g],
            e = c ? c + f : b,
            e in a)
                return e;
            g++
        }
        return d
    }
    function w() {
        return oa++
    }
    function x(a) {
        var b = a.ownerDocument;
        return b.defaultView || b.parentWindow
    }
    function y(a, b) {
        var c = this;
        this.manager = a,
        this.callback = b,
        this.element = a.element,
        this.target = a.options.inputTarget,
        this.domHandler = function(b) {
            l(a.options.enable, [a]) && c.handler(b)
        }
        ,
        this.init()
    }
    function z(a) {
        var b, c = a.options.inputClass;
        return new (b = c ? c : ra ? N : sa ? Q : qa ? S : M)(a,A)
    }
    function A(a, b, c) {
        var d = c.pointers.length
          , e = c.changedPointers.length
          , f = b & ya && 0 === d - e
          , g = b & (Aa | Ba) && 0 === d - e;
        c.isFirst = !!f,
        c.isFinal = !!g,
        f && (a.session = {}),
        c.eventType = b,
        B(a, c),
        a.emit("hammer.input", c),
        a.recognize(c),
        a.session.prevInput = c
    }
    function B(a, b) {
        var c = a.session
          , d = b.pointers
          , e = d.length;
        c.firstInput || (c.firstInput = E(b)),
        e > 1 && !c.firstMultiple ? c.firstMultiple = E(b) : 1 === e && (c.firstMultiple = !1);
        var f = c.firstInput
          , g = c.firstMultiple
          , h = g ? g.center : f.center
          , i = b.center = F(d);
        b.timeStamp = na(),
        b.deltaTime = b.timeStamp - f.timeStamp,
        b.angle = J(h, i),
        b.distance = I(h, i),
        C(c, b),
        b.offsetDirection = H(b.deltaX, b.deltaY),
        b.scale = g ? L(g.pointers, d) : 1,
        b.rotation = g ? K(g.pointers, d) : 0,
        D(c, b);
        var j = a.element;
        p(b.srcEvent.target, j) && (j = b.srcEvent.target),
        b.target = j
    }
    function C(a, b) {
        var c = b.center
          , d = a.offsetDelta || {}
          , e = a.prevDelta || {}
          , f = a.prevInput || {};
        (b.eventType === ya || f.eventType === Aa) && (e = a.prevDelta = {
            x: f.deltaX || 0,
            y: f.deltaY || 0
        },
        d = a.offsetDelta = {
            x: c.x,
            y: c.y
        }),
        b.deltaX = e.x + (c.x - d.x),
        b.deltaY = e.y + (c.y - d.y)
    }
    function D(a, b) {
        var c, e, f, g, h = a.lastInterval || b, i = b.timeStamp - h.timeStamp;
        if (b.eventType != Ba && (i > xa || h.velocity === d)) {
            var j = h.deltaX - b.deltaX
              , k = h.deltaY - b.deltaY
              , l = G(i, j, k);
            e = l.x,
            f = l.y,
            c = ma(l.x) > ma(l.y) ? l.x : l.y,
            g = H(j, k),
            a.lastInterval = b
        } else
            c = h.velocity,
            e = h.velocityX,
            f = h.velocityY,
            g = h.direction;
        b.velocity = c,
        b.velocityX = e,
        b.velocityY = f,
        b.direction = g
    }
    function E(a) {
        for (var b = [], c = 0; c < a.pointers.length; )
            b[c] = {
                clientX: la(a.pointers[c].clientX),
                clientY: la(a.pointers[c].clientY)
            },
            c++;
        return {
            timeStamp: na(),
            pointers: b,
            center: F(b),
            deltaX: a.deltaX,
            deltaY: a.deltaY
        }
    }
    function F(a) {
        var b = a.length;
        if (1 === b)
            return {
                x: la(a[0].clientX),
                y: la(a[0].clientY)
            };
        for (var c = 0, d = 0, e = 0; b > e; )
            c += a[e].clientX,
            d += a[e].clientY,
            e++;
        return {
            x: la(c / b),
            y: la(d / b)
        }
    }
    function G(a, b, c) {
        return {
            x: b / a || 0,
            y: c / a || 0
        }
    }
    function H(a, b) {
        return a === b ? Ca : ma(a) >= ma(b) ? a > 0 ? Da : Ea : b > 0 ? Fa : Ga
    }
    function I(a, b, c) {
        c || (c = Ka);
        var d = b[c[0]] - a[c[0]]
          , e = b[c[1]] - a[c[1]];
        return Math.sqrt(d * d + e * e)
    }
    function J(a, b, c) {
        c || (c = Ka);
        var d = b[c[0]] - a[c[0]]
          , e = b[c[1]] - a[c[1]];
        return 180 * Math.atan2(e, d) / Math.PI
    }
    function K(a, b) {
        return J(b[1], b[0], La) - J(a[1], a[0], La)
    }
    function L(a, b) {
        return I(b[0], b[1], La) / I(a[0], a[1], La)
    }
    function M() {
        this.evEl = Na,
        this.evWin = Oa,
        this.allow = !0,
        this.pressed = !1,
        y.apply(this, arguments)
    }
    function N() {
        this.evEl = Ra,
        this.evWin = Sa,
        y.apply(this, arguments),
        this.store = this.manager.session.pointerEvents = []
    }
    function O() {
        this.evTarget = Ua,
        this.evWin = Va,
        this.started = !1,
        y.apply(this, arguments)
    }
    function P(a, b) {
        var c = t(a.touches)
          , d = t(a.changedTouches);
        return b & (Aa | Ba) && (c = u(c.concat(d), "identifier", !0)),
        [c, d]
    }
    function Q() {
        this.evTarget = Xa,
        this.targetIds = {},
        y.apply(this, arguments)
    }
    function R(a, b) {
        var c = t(a.touches)
          , d = this.targetIds;
        if (b & (ya | za) && 1 === c.length)
            return d[c[0].identifier] = !0,
            [c, c];
        var e, f, g = t(a.changedTouches), h = [], i = this.target;
        if (f = c.filter(function(a) {
            return p(a.target, i)
        }),
        b === ya)
            for (e = 0; e < f.length; )
                d[f[e].identifier] = !0,
                e++;
        for (e = 0; e < g.length; )
            d[g[e].identifier] && h.push(g[e]),
            b & (Aa | Ba) && delete d[g[e].identifier],
            e++;
        return h.length ? [u(f.concat(h), "identifier", !0), h] : void 0
    }
    function S() {
        y.apply(this, arguments);
        var a = k(this.handler, this);
        this.touch = new Q(this.manager,a),
        this.mouse = new M(this.manager,a)
    }
    function T(a, b) {
        this.manager = a,
        this.set(b)
    }
    function U(a) {
        if (q(a, bb))
            return bb;
        var b = q(a, cb)
          , c = q(a, db);
        return b && c ? cb + " " + db : b || c ? b ? cb : db : q(a, ab) ? ab : _a
    }
    function V(a) {
        this.id = w(),
        this.manager = null,
        this.options = i(a || {}, this.defaults),
        this.options.enable = m(this.options.enable, !0),
        this.state = eb,
        this.simultaneous = {},
        this.requireFail = []
    }
    function W(a) {
        return a & jb ? "cancel" : a & hb ? "end" : a & gb ? "move" : a & fb ? "start" : ""
    }
    function X(a) {
        return a == Ga ? "down" : a == Fa ? "up" : a == Da ? "left" : a == Ea ? "right" : ""
    }
    function Y(a, b) {
        var c = b.manager;
        return c ? c.get(a) : a
    }
    function Z() {
        V.apply(this, arguments)
    }
    function $() {
        Z.apply(this, arguments),
        this.pX = null,
        this.pY = null
    }
    function _() {
        Z.apply(this, arguments)
    }
    function aa() {
        V.apply(this, arguments),
        this._timer = null,
        this._input = null
    }
    function ba() {
        Z.apply(this, arguments)
    }
    function ca() {
        Z.apply(this, arguments)
    }
    function da() {
        V.apply(this, arguments),
        this.pTime = !1,
        this.pCenter = !1,
        this._timer = null,
        this._input = null,
        this.count = 0
    }
    function ea(a, b) {
        return b = b || {},
        b.recognizers = m(b.recognizers, ea.defaults.preset),
        new fa(a,b)
    }
    function fa(a, b) {
        b = b || {},
        this.options = i(b, ea.defaults),
        this.options.inputTarget = this.options.inputTarget || a,
        this.handlers = {},
        this.session = {},
        this.recognizers = [],
        this.element = a,
        this.input = z(this),
        this.touchAction = new T(this,this.options.touchAction),
        ga(this, !0),
        g(b.recognizers, function(a) {
            var b = this.add(new a[0](a[1]));
            a[2] && b.recognizeWith(a[2]),
            a[3] && b.requireFailure(a[3])
        }, this)
    }
    function ga(a, b) {
        var c = a.element;
        g(a.options.cssProps, function(a, d) {
            c.style[v(c.style, d)] = b ? a : ""
        })
    }
    function ha(a, c) {
        var d = b.createEvent("Event");
        d.initEvent(a, !0, !0),
        d.gesture = c,
        c.target.dispatchEvent(d)
    }
    var ia = ["", "webkit", "moz", "MS", "ms", "o"]
      , ja = b.createElement("div")
      , ka = "function"
      , la = Math.round
      , ma = Math.abs
      , na = Date.now
      , oa = 1
      , pa = /mobile|tablet|ip(ad|hone|od)|android/i
      , qa = "ontouchstart"in a
      , ra = v(a, "PointerEvent") !== d
      , sa = qa && pa.test(navigator.userAgent)
      , ta = "touch"
      , ua = "pen"
      , va = "mouse"
      , wa = "kinect"
      , xa = 25
      , ya = 1
      , za = 2
      , Aa = 4
      , Ba = 8
      , Ca = 1
      , Da = 2
      , Ea = 4
      , Fa = 8
      , Ga = 16
      , Ha = Da | Ea
      , Ia = Fa | Ga
      , Ja = Ha | Ia
      , Ka = ["x", "y"]
      , La = ["clientX", "clientY"];
    y.prototype = {
        handler: function() {},
        init: function() {
            this.evEl && n(this.element, this.evEl, this.domHandler),
            this.evTarget && n(this.target, this.evTarget, this.domHandler),
            this.evWin && n(x(this.element), this.evWin, this.domHandler)
        },
        destroy: function() {
            this.evEl && o(this.element, this.evEl, this.domHandler),
            this.evTarget && o(this.target, this.evTarget, this.domHandler),
            this.evWin && o(x(this.element), this.evWin, this.domHandler)
        }
    };
    var Ma = {
        mousedown: ya,
        mousemove: za,
        mouseup: Aa
    }
      , Na = "mousedown"
      , Oa = "mousemove mouseup";
    j(M, y, {
        handler: function(a) {
            var b = Ma[a.type];
            b & ya && 0 === a.button && (this.pressed = !0),
            b & za && 1 !== a.which && (b = Aa),
            this.pressed && this.allow && (b & Aa && (this.pressed = !1),
            this.callback(this.manager, b, {
                pointers: [a],
                changedPointers: [a],
                pointerType: va,
                srcEvent: a
            }))
        }
    });
    var Pa = {
        pointerdown: ya,
        pointermove: za,
        pointerup: Aa,
        pointercancel: Ba,
        pointerout: Ba
    }
      , Qa = {
        2: ta,
        3: ua,
        4: va,
        5: wa
    }
      , Ra = "pointerdown"
      , Sa = "pointermove pointerup pointercancel";
    a.MSPointerEvent && (Ra = "MSPointerDown",
    Sa = "MSPointerMove MSPointerUp MSPointerCancel"),
    j(N, y, {
        handler: function(a) {
            var b = this.store
              , c = !1
              , d = a.type.toLowerCase().replace("ms", "")
              , e = Pa[d]
              , f = Qa[a.pointerType] || a.pointerType
              , g = f == ta
              , h = s(b, a.pointerId, "pointerId");
            e & ya && (0 === a.button || g) ? 0 > h && (b.push(a),
            h = b.length - 1) : e & (Aa | Ba) && (c = !0),
            0 > h || (b[h] = a,
            this.callback(this.manager, e, {
                pointers: b,
                changedPointers: [a],
                pointerType: f,
                srcEvent: a
            }),
            c && b.splice(h, 1))
        }
    });
    var Ta = {
        touchstart: ya,
        touchmove: za,
        touchend: Aa,
        touchcancel: Ba
    }
      , Ua = "touchstart"
      , Va = "touchstart touchmove touchend touchcancel";
    j(O, y, {
        handler: function(a) {
            var b = Ta[a.type];
            if (b === ya && (this.started = !0),
            this.started) {
                var c = P.call(this, a, b);
                b & (Aa | Ba) && 0 === c[0].length - c[1].length && (this.started = !1),
                this.callback(this.manager, b, {
                    pointers: c[0],
                    changedPointers: c[1],
                    pointerType: ta,
                    srcEvent: a
                })
            }
        }
    });
    var Wa = {
        touchstart: ya,
        touchmove: za,
        touchend: Aa,
        touchcancel: Ba
    }
      , Xa = "touchstart touchmove touchend touchcancel";
    j(Q, y, {
        handler: function(a) {
            var b = Wa[a.type]
              , c = R.call(this, a, b);
            c && this.callback(this.manager, b, {
                pointers: c[0],
                changedPointers: c[1],
                pointerType: ta,
                srcEvent: a
            })
        }
    }),
    j(S, y, {
        handler: function(a, b, c) {
            var d = c.pointerType == ta
              , e = c.pointerType == va;
            if (d)
                this.mouse.allow = !1;
            else if (e && !this.mouse.allow)
                return;
            b & (Aa | Ba) && (this.mouse.allow = !0),
            this.callback(a, b, c)
        },
        destroy: function() {
            this.touch.destroy(),
            this.mouse.destroy()
        }
    });
    var Ya = v(ja.style, "touchAction")
      , Za = Ya !== d
      , $a = "compute"
      , _a = "auto"
      , ab = "manipulation"
      , bb = "none"
      , cb = "pan-x"
      , db = "pan-y";
    T.prototype = {
        set: function(a) {
            a == $a && (a = this.compute()),
            Za && (this.manager.element.style[Ya] = a),
            this.actions = a.toLowerCase().trim()
        },
        update: function() {
            this.set(this.manager.options.touchAction)
        },
        compute: function() {
            var a = [];
            return g(this.manager.recognizers, function(b) {
                l(b.options.enable, [b]) && (a = a.concat(b.getTouchAction()))
            }),
            U(a.join(" "))
        },
        preventDefaults: function(a) {
            if (!Za) {
                var b = a.srcEvent
                  , c = a.offsetDirection;
                if (this.manager.session.prevented)
                    return void b.preventDefault();
                var d = this.actions
                  , e = q(d, bb)
                  , f = q(d, db)
                  , g = q(d, cb);
                return e || f && c & Ha || g && c & Ia ? this.preventSrc(b) : void 0
            }
        },
        preventSrc: function(a) {
            this.manager.session.prevented = !0,
            a.preventDefault()
        }
    };
    var eb = 1
      , fb = 2
      , gb = 4
      , hb = 8
      , ib = hb
      , jb = 16
      , kb = 32;
    V.prototype = {
        defaults: {},
        set: function(a) {
            return h(this.options, a),
            this.manager && this.manager.touchAction.update(),
            this
        },
        recognizeWith: function(a) {
            if (f(a, "recognizeWith", this))
                return this;
            var b = this.simultaneous;
            return a = Y(a, this),
            b[a.id] || (b[a.id] = a,
            a.recognizeWith(this)),
            this
        },
        dropRecognizeWith: function(a) {
            return f(a, "dropRecognizeWith", this) ? this : (a = Y(a, this),
            delete this.simultaneous[a.id],
            this)
        },
        requireFailure: function(a) {
            if (f(a, "requireFailure", this))
                return this;
            var b = this.requireFail;
            return a = Y(a, this),
            -1 === s(b, a) && (b.push(a),
            a.requireFailure(this)),
            this
        },
        dropRequireFailure: function(a) {
            if (f(a, "dropRequireFailure", this))
                return this;
            a = Y(a, this);
            var b = s(this.requireFail, a);
            return b > -1 && this.requireFail.splice(b, 1),
            this
        },
        hasRequireFailures: function() {
            return this.requireFail.length > 0
        },
        canRecognizeWith: function(a) {
            return !!this.simultaneous[a.id]
        },
        emit: function(a) {
            function b(b) {
                c.manager.emit(c.options.event + (b ? W(d) : ""), a)
            }
            var c = this
              , d = this.state;
            hb > d && b(!0),
            b(),
            d >= hb && b(!0)
        },
        tryEmit: function(a) {
            return this.canEmit() ? this.emit(a) : void (this.state = kb)
        },
        canEmit: function() {
            for (var a = 0; a < this.requireFail.length; ) {
                if (!(this.requireFail[a].state & (kb | eb)))
                    return !1;
                a++
            }
            return !0
        },
        recognize: function(a) {
            var b = h({}, a);
            return l(this.options.enable, [this, b]) ? (this.state & (ib | jb | kb) && (this.state = eb),
            this.state = this.process(b),
            void (this.state & (fb | gb | hb | jb) && this.tryEmit(b))) : (this.reset(),
            void (this.state = kb))
        },
        process: function() {},
        getTouchAction: function() {},
        reset: function() {}
    },
    j(Z, V, {
        defaults: {
            pointers: 1
        },
        attrTest: function(a) {
            var b = this.options.pointers;
            return 0 === b || a.pointers.length === b
        },
        process: function(a) {
            var b = this.state
              , c = a.eventType
              , d = b & (fb | gb)
              , e = this.attrTest(a);
            return d && (c & Ba || !e) ? b | jb : d || e ? c & Aa ? b | hb : b & fb ? b | gb : fb : kb
        }
    }),
    j($, Z, {
        defaults: {
            event: "pan",
            threshold: 10,
            pointers: 1,
            direction: Ja
        },
        getTouchAction: function() {
            var a = this.options.direction
              , b = [];
            return a & Ha && b.push(db),
            a & Ia && b.push(cb),
            b
        },
        directionTest: function(a) {
            var b = this.options
              , c = !0
              , d = a.distance
              , e = a.direction
              , f = a.deltaX
              , g = a.deltaY;
            return e & b.direction || (b.direction & Ha ? (e = 0 === f ? Ca : 0 > f ? Da : Ea,
            c = f != this.pX,
            d = Math.abs(a.deltaX)) : (e = 0 === g ? Ca : 0 > g ? Fa : Ga,
            c = g != this.pY,
            d = Math.abs(a.deltaY))),
            a.direction = e,
            c && d > b.threshold && e & b.direction
        },
        attrTest: function(a) {
            return Z.prototype.attrTest.call(this, a) && (this.state & fb || !(this.state & fb) && this.directionTest(a))
        },
        emit: function(a) {
            this.pX = a.deltaX,
            this.pY = a.deltaY;
            var b = X(a.direction);
            b && this.manager.emit(this.options.event + b, a),
            this._super.emit.call(this, a)
        }
    }),
    j(_, Z, {
        defaults: {
            event: "pinch",
            threshold: 0,
            pointers: 2
        },
        getTouchAction: function() {
            return [bb]
        },
        attrTest: function(a) {
            return this._super.attrTest.call(this, a) && (Math.abs(a.scale - 1) > this.options.threshold || this.state & fb)
        },
        emit: function(a) {
            if (this._super.emit.call(this, a),
            1 !== a.scale) {
                var b = a.scale < 1 ? "in" : "out";
                this.manager.emit(this.options.event + b, a)
            }
        }
    }),
    j(aa, V, {
        defaults: {
            event: "press",
            pointers: 1,
            time: 500,
            threshold: 5
        },
        getTouchAction: function() {
            return [_a]
        },
        process: function(a) {
            var b = this.options
              , c = a.pointers.length === b.pointers
              , d = a.distance < b.threshold
              , f = a.deltaTime > b.time;
            if (this._input = a,
            !d || !c || a.eventType & (Aa | Ba) && !f)
                this.reset();
            else if (a.eventType & ya)
                this.reset(),
                this._timer = e(function() {
                    this.state = ib,
                    this.tryEmit()
                }, b.time, this);
            else if (a.eventType & Aa)
                return ib;
            return kb
        },
        reset: function() {
            clearTimeout(this._timer)
        },
        emit: function(a) {
            this.state === ib && (a && a.eventType & Aa ? this.manager.emit(this.options.event + "up", a) : (this._input.timeStamp = na(),
            this.manager.emit(this.options.event, this._input)))
        }
    }),
    j(ba, Z, {
        defaults: {
            event: "rotate",
            threshold: 0,
            pointers: 2
        },
        getTouchAction: function() {
            return [bb]
        },
        attrTest: function(a) {
            return this._super.attrTest.call(this, a) && (Math.abs(a.rotation) > this.options.threshold || this.state & fb)
        }
    }),
    j(ca, Z, {
        defaults: {
            event: "swipe",
            threshold: 10,
            velocity: .65,
            direction: Ha | Ia,
            pointers: 1
        },
        getTouchAction: function() {
            return $.prototype.getTouchAction.call(this)
        },
        attrTest: function(a) {
            var b, c = this.options.direction;
            return c & (Ha | Ia) ? b = a.velocity : c & Ha ? b = a.velocityX : c & Ia && (b = a.velocityY),
            this._super.attrTest.call(this, a) && c & a.direction && a.distance > this.options.threshold && ma(b) > this.options.velocity && a.eventType & Aa
        },
        emit: function(a) {
            var b = X(a.direction);
            b && this.manager.emit(this.options.event + b, a),
            this.manager.emit(this.options.event, a)
        }
    }),
    j(da, V, {
        defaults: {
            event: "tap",
            pointers: 1,
            taps: 1,
            interval: 300,
            time: 250,
            threshold: 2,
            posThreshold: 10
        },
        getTouchAction: function() {
            return [ab]
        },
        process: function(a) {
            var b = this.options
              , c = a.pointers.length === b.pointers
              , d = a.distance < b.threshold
              , f = a.deltaTime < b.time;
            if (this.reset(),
            a.eventType & ya && 0 === this.count)
                return this.failTimeout();
            if (d && f && c) {
                if (a.eventType != Aa)
                    return this.failTimeout();
                var g = this.pTime ? a.timeStamp - this.pTime < b.interval : !0
                  , h = !this.pCenter || I(this.pCenter, a.center) < b.posThreshold;
                this.pTime = a.timeStamp,
                this.pCenter = a.center,
                h && g ? this.count += 1 : this.count = 1,
                this._input = a;
                var i = this.count % b.taps;
                if (0 === i)
                    return this.hasRequireFailures() ? (this._timer = e(function() {
                        this.state = ib,
                        this.tryEmit()
                    }, b.interval, this),
                    fb) : ib
            }
            return kb
        },
        failTimeout: function() {
            return this._timer = e(function() {
                this.state = kb
            }, this.options.interval, this),
            kb
        },
        reset: function() {
            clearTimeout(this._timer)
        },
        emit: function() {
            this.state == ib && (this._input.tapCount = this.count,
            this.manager.emit(this.options.event, this._input))
        }
    }),
    ea.VERSION = "2.0.4",
    ea.defaults = {
        domEvents: !1,
        touchAction: $a,
        enable: !0,
        inputTarget: null,
        inputClass: null,
        preset: [[ba, {
            enable: !1
        }], [_, {
            enable: !1
        }, ["rotate"]], [ca, {
            direction: Ha
        }], [$, {
            direction: Ha
        }, ["swipe"]], [da], [da, {
            event: "doubletap",
            taps: 2
        }, ["tap"]], [aa]],
        cssProps: {
            userSelect: "default",
            touchSelect: "none",
            touchCallout: "none",
            contentZooming: "none",
            userDrag: "none",
            tapHighlightColor: "rgba(0,0,0,0)"
        }
    };
    var lb = 1
      , mb = 2;
    fa.prototype = {
        set: function(a) {
            return h(this.options, a),
            a.touchAction && this.touchAction.update(),
            a.inputTarget && (this.input.destroy(),
            this.input.target = a.inputTarget,
            this.input.init()),
            this
        },
        stop: function(a) {
            this.session.stopped = a ? mb : lb
        },
        recognize: function(a) {
            var b = this.session;
            if (!b.stopped) {
                this.touchAction.preventDefaults(a);
                var c, d = this.recognizers, e = b.curRecognizer;
                (!e || e && e.state & ib) && (e = b.curRecognizer = null);
                for (var f = 0; f < d.length; )
                    c = d[f],
                    b.stopped === mb || e && c != e && !c.canRecognizeWith(e) ? c.reset() : c.recognize(a),
                    !e && c.state & (fb | gb | hb) && (e = b.curRecognizer = c),
                    f++
            }
        },
        get: function(a) {
            if (a instanceof V)
                return a;
            for (var b = this.recognizers, c = 0; c < b.length; c++)
                if (b[c].options.event == a)
                    return b[c];
            return null
        },
        add: function(a) {
            if (f(a, "add", this))
                return this;
            var b = this.get(a.options.event);
            return b && this.remove(b),
            this.recognizers.push(a),
            a.manager = this,
            this.touchAction.update(),
            a
        },
        remove: function(a) {
            if (f(a, "remove", this))
                return this;
            var b = this.recognizers;
            return a = this.get(a),
            b.splice(s(b, a), 1),
            this.touchAction.update(),
            this
        },
        on: function(a, b) {
            var c = this.handlers;
            return g(r(a), function(a) {
                c[a] = c[a] || [],
                c[a].push(b)
            }),
            this
        },
        off: function(a, b) {
            var c = this.handlers;
            return g(r(a), function(a) {
                b ? c[a].splice(s(c[a], b), 1) : delete c[a]
            }),
            this
        },
        emit: function(a, b) {
            this.options.domEvents && ha(a, b);
            var c = this.handlers[a] && this.handlers[a].slice();
            if (c && c.length) {
                b.type = a,
                b.preventDefault = function() {
                    b.srcEvent.preventDefault()
                }
                ;
                for (var d = 0; d < c.length; )
                    c[d](b),
                    d++
            }
        },
        destroy: function() {
            this.element && ga(this, !1),
            this.handlers = {},
            this.session = {},
            this.input.destroy(),
            this.element = null
        }
    },
    h(ea, {
        INPUT_START: ya,
        INPUT_MOVE: za,
        INPUT_END: Aa,
        INPUT_CANCEL: Ba,
        STATE_POSSIBLE: eb,
        STATE_BEGAN: fb,
        STATE_CHANGED: gb,
        STATE_ENDED: hb,
        STATE_RECOGNIZED: ib,
        STATE_CANCELLED: jb,
        STATE_FAILED: kb,
        DIRECTION_NONE: Ca,
        DIRECTION_LEFT: Da,
        DIRECTION_RIGHT: Ea,
        DIRECTION_UP: Fa,
        DIRECTION_DOWN: Ga,
        DIRECTION_HORIZONTAL: Ha,
        DIRECTION_VERTICAL: Ia,
        DIRECTION_ALL: Ja,
        Manager: fa,
        Input: y,
        TouchAction: T,
        TouchInput: Q,
        MouseInput: M,
        PointerEventInput: N,
        TouchMouseInput: S,
        SingleTouchInput: O,
        Recognizer: V,
        AttrRecognizer: Z,
        Tap: da,
        Pan: $,
        Swipe: ca,
        Pinch: _,
        Rotate: ba,
        Press: aa,
        on: n,
        off: o,
        each: g,
        merge: i,
        extend: h,
        inherit: j,
        bindFn: k,
        prefixed: v
    }),
    typeof define == ka && false ? define(function() {
        return ea
    }) : "undefined" != typeof module && module.exports ? module.exports = ea : a[c] = ea
}(window, document, "Hammer"),
function(a) {
    "function" == typeof define && false ? define(["jquery", "hammerjs"], a) : "object" == typeof exports ? a(require("jquery"), require("hammerjs")) : a(jQuery, Hammer)
}(function(a, b) {
    function c(c, d) {
        var e = a(c);
        e.data("hammer") || e.data("hammer", new b(e[0],d))
    }
    a.fn.hammer = function(a) {
        return this.each(function() {
            c(this, a)
        })
    }
    ,
    b.Manager.prototype.emit = function(b) {
        return function(c, d) {
            b.call(this, c, d),
            a(this.element).trigger({
                type: c,
                gesture: d
            })
        }
    }(b.Manager.prototype.emit)
}),
function(a) {
    a.Package ? Materialize = {} : a.Materialize = {}
}(window),
Materialize.guid = function() {
    function a() {
        return Math.floor(65536 * (1 + Math.random())).toString(16).substring(1)
    }
    return function() {
        return a() + a() + "-" + a() + "-" + a() + "-" + a() + "-" + a() + a() + a()
    }
}(),
Materialize.elementOrParentIsFixed = function(a) {
    var b = $(a)
      , c = b.add(b.parents())
      , d = !1;
    return c.each(function() {
        return "fixed" === $(this).css("position") ? (d = !0,
        !1) : void 0
    }),
    d
}
;
var Vel;
Vel = $ ? $.Velocity : jQuery ? jQuery.Velocity : Velocity,
function(a) {
    a.fn.collapsible = function(b) {
        var c = {
            accordion: void 0
        };
        return b = a.extend(c, b),
        this.each(function() {
            function c(b) {
                h = g.find("> li > .collapsible-header"),
                b.hasClass("active") ? b.parent().addClass("active") : b.parent().removeClass("active"),
                b.parent().hasClass("active") ? b.siblings(".collapsible-body").stop(!0, !1).slideDown({
                    duration: 350,
                    easing: "easeOutQuart",
                    queue: !1,
                    complete: function() {
                        a(this).css("height", "")
                    }
                }) : b.siblings(".collapsible-body").stop(!0, !1).slideUp({
                    duration: 350,
                    easing: "easeOutQuart",
                    queue: !1,
                    complete: function() {
                        a(this).css("height", "")
                    }
                }),
                h.not(b).removeClass("active").parent().removeClass("active"),
                h.not(b).parent().children(".collapsible-body").stop(!0, !1).slideUp({
                    duration: 350,
                    easing: "easeOutQuart",
                    queue: !1,
                    complete: function() {
                        a(this).css("height", "")
                    }
                })
            }
            function d(b) {
                b.hasClass("active") ? b.parent().addClass("active") : b.parent().removeClass("active"),
                b.parent().hasClass("active") ? b.siblings(".collapsible-body").stop(!0, !1).slideDown({
                    duration: 350,
                    easing: "easeOutQuart",
                    queue: !1,
                    complete: function() {
                        a(this).css("height", "")
                    }
                }) : b.siblings(".collapsible-body").stop(!0, !1).slideUp({
                    duration: 350,
                    easing: "easeOutQuart",
                    queue: !1,
                    complete: function() {
                        a(this).css("height", "")
                    }
                })
            }
            function e(a) {
                var b = f(a);
                return b.length > 0
            }
            function f(a) {
                return a.closest("li > .collapsible-header")
            }
            var g = a(this)
              , h = a(this).find("> li > .collapsible-header")
              , i = g.data("collapsible");
            g.off("click.collapse", "> li > .collapsible-header"),
            h.off("click.collapse"),
            g.on("click.collapse", "> li > .collapsible-header", function(g) {
                var h = a(this)
                  , j = a(g.target);
                e(j) && (j = f(j)),
                j.toggleClass("active"),
                b.accordion || "accordion" === i || void 0 === i ? c(j) : (d(j),
                h.hasClass("active") && d(h))
            });
            var h = g.find("> li > .collapsible-header");
            b.accordion || "accordion" === i || void 0 === i ? c(h.filter(".active").first()) : h.filter(".active").each(function() {
                d(a(this))
            })
        })
    }
    ,
    a(document).ready(function() {
        a(".collapsible").collapsible()
    })
}(jQuery),
function(a) {
    a.fn.scrollTo = function(b) {
        return a(this).scrollTop(a(this).scrollTop() - a(this).offset().top + a(b).offset().top),
        this
    }
    ,
    a.fn.dropdown = function(b) {
        var c = {
            inDuration: 300,
            outDuration: 225,
            constrain_width: !0,
            hover: !1,
            gutter: 0,
            belowOrigin: !1,
            alignment: "left"
        };
        this.each(function() {
            function d() {
                void 0 !== g.data("induration") && (h.inDuration = g.data("inDuration")),
                void 0 !== g.data("outduration") && (h.outDuration = g.data("outDuration")),
                void 0 !== g.data("constrainwidth") && (h.constrain_width = g.data("constrainwidth")),
                void 0 !== g.data("hover") && (h.hover = g.data("hover")),
                void 0 !== g.data("gutter") && (h.gutter = g.data("gutter")),
                void 0 !== g.data("beloworigin") && (h.belowOrigin = g.data("beloworigin")),
                void 0 !== g.data("alignment") && (h.alignment = g.data("alignment"))
            }
            function e(b) {
                "focus" === b && (i = !0),
                d(),
                j.addClass("active"),
                g.addClass("active"),
                h.constrain_width === !0 ? j.css("width", g.outerWidth()) : j.css("white-space", "nowrap");
                var c, e = window.innerHeight, f = g.innerHeight(), k = g.offset().left, l = g.offset().top - a(window).scrollTop(), m = h.alignment, n = 0;
                if (h.belowOrigin === !0 && (n = f),
                k + j.innerWidth() > a(window).width() ? m = "right" : k - j.innerWidth() + g.innerWidth() < 0 && (m = "left"),
                l + j.innerHeight() > e)
                    if (l + f - j.innerHeight() < 0) {
                        var o = e - l - n;
                        j.css("max-height", o)
                    } else
                        n || (n += f),
                        n -= j.innerHeight();
                if ("left" === m)
                    c = h.gutter,
                    leftPosition = g.position().left + c;
                else if ("right" === m) {
                    var p = g.position().left + g.outerWidth() - j.outerWidth();
                    c = -h.gutter,
                    leftPosition = p + c
                }
                j.css({
                    position: "absolute",
                    top: g.position().top + n,
                    left: leftPosition
                }),
                j.stop(!0, !0).css("opacity", 0).slideDown({
                    queue: !1,
                    duration: h.inDuration,
                    easing: "easeOutCubic",
                    complete: function() {
                        a(this).css("height", "")
                    }
                }).animate({
                    opacity: 1
                }, {
                    queue: !1,
                    duration: h.inDuration,
                    easing: "easeOutSine"
                })
            }
            function f() {
                i = !1,
                j.fadeOut(h.outDuration),
                j.removeClass("active"),
                g.removeClass("active"),
                setTimeout(function() {
                    j.css("max-height", "")
                }, h.outDuration)
            }
            var g = a(this)
              , h = a.extend({}, c, b)
              , i = !1
              , j = a("#" + g.attr("data-activates"));
            if (d(),
            g.after(j),
            h.hover) {
                var k = !1;
                g.unbind("click." + g.attr("id")),
                g.on("mouseenter", function(a) {
                    k === !1 && (e(),
                    k = !0)
                }),
                g.on("mouseleave", function(b) {
                    var c = b.toElement || b.relatedTarget;
                    a(c).closest(".dropdown-content").is(j) || (j.stop(!0, !0),
                    f(),
                    k = !1)
                }),
                j.on("mouseleave", function(b) {
                    var c = b.toElement || b.relatedTarget;
                    a(c).closest(".dropdown-button").is(g) || (j.stop(!0, !0),
                    f(),
                    k = !1)
                })
            } else
                g.unbind("click." + g.attr("id")),
                g.bind("click." + g.attr("id"), function(b) {
                    i || (g[0] != b.currentTarget || g.hasClass("active") || 0 !== a(b.target).closest(".dropdown-content").length ? g.hasClass("active") && (f(),
                    a(document).unbind("click." + j.attr("id") + " touchstart." + j.attr("id"))) : (b.preventDefault(),
                    e("click")),
                    j.hasClass("active") && a(document).bind("click." + j.attr("id") + " touchstart." + j.attr("id"), function(b) {
                        j.is(b.target) || g.is(b.target) || g.find(b.target).length || (f(),
                        a(document).unbind("click." + j.attr("id") + " touchstart." + j.attr("id")))
                    }))
                });
            g.on("open", function(a, b) {
                e(b)
            }),
            g.on("close", f)
        })
    }
    ,
    a(document).ready(function() {
        a(".dropdown-button").dropdown()
    })
}(jQuery),
function(a) {
    var b = 0
      , c = 0
      , d = function() {
        return c++,
        "materialize-lean-overlay-" + c
    };
    a.fn.extend({
        openModal: function(c) {
            a("body").css("overflow", "hidden");
            var e = {
                opacity: .5,
                in_duration: 350,
                out_duration: 250,
                ready: void 0,
                complete: void 0,
                dismissible: !0,
                starting_top: "4%"
            }
              , f = d()
              , g = a(this)
              , h = a('<div class="lean-overlay"></div>')
              , i = ++b;
            h.attr("id", f).css("z-index", 1e3 + 2 * i),
            g.data("overlay-id", f).css("z-index", 1e3 + 2 * i + 1),
            a("body").append(h),
            c = a.extend(e, c),
            c.dismissible && (h.click(function() {
                g.closeModal(c)
            }),
            a(document).on("keyup.leanModal" + f, function(a) {
                27 === a.keyCode && g.closeModal(c)
            })),
            g.find(".modal-close").on("click.close", function(a) {
                g.closeModal(c)
            }),
            h.css({
                display: "block",
                opacity: 0
            }),
            g.css({
                display: "block",
                opacity: 0
            }),
            h.velocity({
                opacity: c.opacity
            }, {
                duration: c.in_duration,
                queue: !1,
                ease: "easeOutCubic"
            }),
            g.data("associated-overlay", h[0]),
            g.hasClass("bottom-sheet") ? g.velocity({
                bottom: "0",
                opacity: 1
            }, {
                duration: c.in_duration,
                queue: !1,
                ease: "easeOutCubic",
                complete: function() {
                    "function" == typeof c.ready && c.ready()
                }
            }) : (a.Velocity.hook(g, "scaleX", .7),
            g.css({
                top: c.starting_top
            }),
            g.velocity({
                top: "10%",
                opacity: 1,
                scaleX: "1"
            }, {
                duration: c.in_duration,
                queue: !1,
                ease: "easeOutCubic",
                complete: function() {
                    "function" == typeof c.ready && c.ready()
                }
            }))
        }
    }),
    a.fn.extend({
        closeModal: function(c) {
            var d = {
                out_duration: 250,
                complete: void 0
            }
              , e = a(this)
              , f = e.data("overlay-id")
              , g = a("#" + f);
            c = a.extend(d, c),
            a("body").css("overflow", ""),
            e.find(".modal-close").off("click.close"),
            a(document).off("keyup.leanModal" + f),
            g.velocity({
                opacity: 0
            }, {
                duration: c.out_duration,
                queue: !1,
                ease: "easeOutQuart"
            }),
            e.hasClass("bottom-sheet") ? e.velocity({
                bottom: "-100%",
                opacity: 0
            }, {
                duration: c.out_duration,
                queue: !1,
                ease: "easeOutCubic",
                complete: function() {
                    g.css({
                        display: "none"
                    }),
                    "function" == typeof c.complete && c.complete(),
                    g.remove(),
                    b--
                }
            }) : e.velocity({
                top: c.starting_top,
                opacity: 0,
                scaleX: .7
            }, {
                duration: c.out_duration,
                complete: function() {
                    a(this).css("display", "none"),
                    "function" == typeof c.complete && c.complete(),
                    g.remove(),
                    b--
                }
            })
        }
    }),
    a.fn.extend({
        leanModal: function(b) {
            return this.each(function() {
                var c = {
                    starting_top: "4%"
                }
                  , d = a.extend(c, b);
                a(this).click(function(b) {
                    d.starting_top = (a(this).offset().top - a(window).scrollTop()) / 1.15;
                    var c = a(this).attr("href") || "#" + a(this).data("target");
                    a(c).openModal(d),
                    b.preventDefault()
                })
            })
        }
    })
}(jQuery),
function(a) {
    a.fn.materialbox = function() {
        return this.each(function() {
            function b() {
                f = !1;
                var b = i.parent(".material-placeholder")
                  , d = (window.innerWidth,
                window.innerHeight,
                i.data("width"))
                  , g = i.data("height");
                i.velocity("stop", !0),
                a("#materialbox-overlay").velocity("stop", !0),
                a(".materialbox-caption").velocity("stop", !0),
                a("#materialbox-overlay").velocity({
                    opacity: 0
                }, {
                    duration: h,
                    queue: !1,
                    easing: "easeOutQuad",
                    complete: function() {
                        e = !1,
                        a(this).remove()
                    }
                }),
                i.velocity({
                    width: d,
                    height: g,
                    left: 0,
                    top: 0
                }, {
                    duration: h,
                    queue: !1,
                    easing: "easeOutQuad"
                }),
                a(".materialbox-caption").velocity({
                    opacity: 0
                }, {
                    duration: h,
                    queue: !1,
                    easing: "easeOutQuad",
                    complete: function() {
                        b.css({
                            height: "",
                            width: "",
                            position: "",
                            top: "",
                            left: ""
                        }),
                        i.css({
                            height: "",
                            top: "",
                            left: "",
                            width: "",
                            "max-width": "",
                            position: "",
                            "z-index": ""
                        }),
                        i.removeClass("active"),
                        f = !0,
                        a(this).remove(),
                        c.css("overflow", "")
                    }
                })
            }
            if (!a(this).hasClass("initialized")) {
                a(this).addClass("initialized");
                var c, d, e = !1, f = !0, g = 275, h = 200, i = a(this), j = a("<div></div>").addClass("material-placeholder");
                i.wrap(j),
                i.on("click", function() {
                    var h = i.parent(".material-placeholder")
                      , j = window.innerWidth
                      , k = window.innerHeight
                      , l = i.width()
                      , m = i.height();
                    if (f === !1)
                        return b(),
                        !1;
                    if (e && f === !0)
                        return b(),
                        !1;
                    f = !1,
                    i.addClass("active"),
                    e = !0,
                    h.css({
                        width: h[0].getBoundingClientRect().width,
                        height: h[0].getBoundingClientRect().height,
                        position: "relative",
                        top: 0,
                        left: 0
                    }),
                    c = void 0,
                    d = h[0].parentNode;
                    for (; null !== d && !a(d).is(document); ) {
                        var n = a(d);
                        "hidden" === n.css("overflow") && (n.css("overflow", "visible"),
                        c = void 0 === c ? n : c.add(n)),
                        d = d.parentNode
                    }
                    i.css({
                        position: "absolute",
                        "z-index": 1e3
                    }).data("width", l).data("height", m);
                    var o = a('<div id="materialbox-overlay"></div>').css({
                        opacity: 0
                    }).click(function() {
                        f === !0 && b()
                    });
                    if (a("body").append(o),
                    o.velocity({
                        opacity: 1
                    }, {
                        duration: g,
                        queue: !1,
                        easing: "easeOutQuad"
                    }),
                    "" !== i.data("caption")) {
                        var p = a('<div class="materialbox-caption"></div>');
                        p.text(i.data("caption")),
                        a("body").append(p),
                        p.css({
                            display: "inline"
                        }),
                        p.velocity({
                            opacity: 1
                        }, {
                            duration: g,
                            queue: !1,
                            easing: "easeOutQuad"
                        })
                    }
                    var q = 0
                      , r = l / j
                      , s = m / k
                      , t = 0
                      , u = 0;
                    r > s ? (q = m / l,
                    t = .9 * j,
                    u = .9 * j * q) : (q = l / m,
                    t = .9 * k * q,
                    u = .9 * k),
                    i.hasClass("responsive-img") ? i.velocity({
                        "max-width": t,
                        width: l
                    }, {
                        duration: 0,
                        queue: !1,
                        complete: function() {
                            i.css({
                                left: 0,
                                top: 0
                            }).velocity({
                                height: u,
                                width: t,
                                left: a(document).scrollLeft() + j / 2 - i.parent(".material-placeholder").offset().left - t / 2,
                                top: a(document).scrollTop() + k / 2 - i.parent(".material-placeholder").offset().top - u / 2
                            }, {
                                duration: g,
                                queue: !1,
                                easing: "easeOutQuad",
                                complete: function() {
                                    f = !0
                                }
                            })
                        }
                    }) : i.css("left", 0).css("top", 0).velocity({
                        height: u,
                        width: t,
                        left: a(document).scrollLeft() + j / 2 - i.parent(".material-placeholder").offset().left - t / 2,
                        top: a(document).scrollTop() + k / 2 - i.parent(".material-placeholder").offset().top - u / 2
                    }, {
                        duration: g,
                        queue: !1,
                        easing: "easeOutQuad",
                        complete: function() {
                            f = !0
                        }
                    })
                }),
                a(window).scroll(function() {
                    e && b()
                }),
                a(document).keyup(function(a) {
                    27 === a.keyCode && f === !0 && e && b()
                })
            }
        })
    }
    ,
    a(document).ready(function() {
        a(".materialboxed").materialbox()
    })
}(jQuery),
function(a) {
    a.fn.parallax = function() {
        var b = a(window).width();
        return this.each(function(c) {
            function d(c) {
                var d;
                d = 601 > b ? e.height() > 0 ? e.height() : e.children("img").height() : e.height() > 0 ? e.height() : 500;
                var f = e.children("img").first()
                  , g = f.height()
                  , h = g - d
                  , i = e.offset().top + d
                  , j = e.offset().top
                  , k = a(window).scrollTop()
                  , l = window.innerHeight
                  , m = k + l
                  , n = (m - j) / (d + l)
                  , o = Math.round(h * n);
                c && f.css("display", "block"),
                i > k && k + l > j && f.css("transform", "translate3D(-50%," + o + "px, 0)")
            }
            var e = a(this);
            e.addClass("parallax"),
            e.children("img").one("load", function() {
                d(!0)
            }).each(function() {
                this.complete && a(this).load()
            }),
            a(window).scroll(function() {
                b = a(window).width(),
                d(!1)
            }),
            a(window).resize(function() {
                b = a(window).width(),
                d(!1)
            })
        })
    }
}(jQuery),
function(a) {
    var b = {
        init: function() {
            return this.each(function() {
                var b = a(this);
                a(window).width();
                b.width("100%");
                var c, d, e = b.find("li.tab a"), f = b.width(), g = b.find("li").first().outerWidth(), h = 0;
                c = a(e.filter('[href="' + location.hash + '"]')),
                0 === c.length && (c = a(this).find("li.tab a.active").first()),
                0 === c.length && (c = a(this).find("li.tab a").first()),
                c.addClass("active"),
                h = e.index(c),
                0 > h && (h = 0),
                d = a(c[0].hash),
                b.append('<div class="indicator"></div>');
                var i = b.find(".indicator");
                b.is(":visible") && (i.css({
                    right: f - (h + 1) * g
                }),
                i.css({
                    left: h * g
                })),
                a(window).resize(function() {
                    f = b.width(),
                    g = b.find("li").first().outerWidth(),
                    0 > h && (h = 0),
                    0 !== g && 0 !== f && (i.css({
                        right: f - (h + 1) * g
                    }),
                    i.css({
                        left: h * g
                    }))
                }),
                e.not(c).each(function() {
                    a(this.hash).hide()
                }),
                b.on("click", "a", function(j) {
                    if (a(this).parent().hasClass("disabled"))
                        return void j.preventDefault();
                    f = b.width(),
                    g = b.find("li").first().outerWidth(),
                    c.removeClass("active"),
                    d.hide(),
                    c = a(this),
                    d = a(this.hash),
                    e = b.find("li.tab a"),
                    c.addClass("active");
                    var k = h;
                    h = e.index(a(this)),
                    0 > h && (h = 0),
                    d.show(),
                    h - k >= 0 ? (i.velocity({
                        right: f - (h + 1) * g
                    }, {
                        duration: 300,
                        queue: !1,
                        easing: "easeOutQuad"
                    }),
                    i.velocity({
                        left: h * g
                    }, {
                        duration: 300,
                        queue: !1,
                        easing: "easeOutQuad",
                        delay: 90
                    })) : (i.velocity({
                        left: h * g
                    }, {
                        duration: 300,
                        queue: !1,
                        easing: "easeOutQuad"
                    }),
                    i.velocity({
                        right: f - (h + 1) * g
                    }, {
                        duration: 300,
                        queue: !1,
                        easing: "easeOutQuad",
                        delay: 90
                    })),
                    j.preventDefault()
                })
            })
        },
        select_tab: function(a) {
            this.find('a[href="#' + a + '"]').trigger("click")
        }
    };
    a.fn.tabs = function(c) {
        return b[c] ? b[c].apply(this, Array.prototype.slice.call(arguments, 1)) : "object" != typeof c && c ? void a.error("Method " + c + " does not exist on jQuery.tooltip") : b.init.apply(this, arguments)
    }
    ,
    a(document).ready(function() {
        a("ul.tabs").tabs()
    })
}(jQuery),
function(a) {
    a.fn.tooltip = function(c) {
        var d = 5
          , e = {
            delay: 350
        };
        return "remove" === c ? (this.each(function() {
            a("#" + a(this).attr("data-tooltip-id")).remove(),
            a(this).off("mouseenter.tooltip mouseleave.tooltip")
        }),
        !1) : (c = a.extend(e, c),
        this.each(function() {
            var e = Materialize.guid()
              , f = a(this);
            f.attr("data-tooltip-id", e);
            var g = a("<span></span>").text(f.attr("data-tooltip"))
              , h = a("<div></div>");
            h.addClass("material-tooltip").append(g).appendTo(a("body")).attr("id", e);
            var i = a("<div></div>").addClass("backdrop");
            i.appendTo(h),
            i.css({
                top: 0,
                left: 0
            }),
            f.off("mouseenter.tooltip mouseleave.tooltip");
            var j, k = !1;
            f.on({
                "mouseenter.tooltip": function(a) {
                    var e = f.attr("data-delay");
                    e = void 0 === e || "" === e ? c.delay : e,
                    j = setTimeout(function() {
                        k = !0,
                        h.velocity("stop"),
                        i.velocity("stop"),
                        h.css({
                            display: "block",
                            left: "0px",
                            top: "0px"
                        }),
                        h.children("span").text(f.attr("data-tooltip"));
                        var a, c, e, g = f.outerWidth(), j = f.outerHeight(), l = f.attr("data-position"), m = h.outerHeight(), n = h.outerWidth(), o = "0px", p = "0px", q = 8;
                        "top" === l ? (a = f.offset().top - m - d,
                        c = f.offset().left + g / 2 - n / 2,
                        e = b(c, a, n, m),
                        o = "-10px",
                        i.css({
                            borderRadius: "14px 14px 0 0",
                            transformOrigin: "50% 90%",
                            marginTop: m,
                            marginLeft: n / 2 - i.width() / 2
                        })) : "left" === l ? (a = f.offset().top + j / 2 - m / 2,
                        c = f.offset().left - n - d,
                        e = b(c, a, n, m),
                        p = "-10px",
                        i.css({
                            width: "14px",
                            height: "14px",
                            borderRadius: "14px 0 0 14px",
                            transformOrigin: "95% 50%",
                            marginTop: m / 2,
                            marginLeft: n
                        })) : "right" === l ? (a = f.offset().top + j / 2 - m / 2,
                        c = f.offset().left + g + d,
                        e = b(c, a, n, m),
                        p = "+10px",
                        i.css({
                            width: "14px",
                            height: "14px",
                            borderRadius: "0 14px 14px 0",
                            transformOrigin: "5% 50%",
                            marginTop: m / 2,
                            marginLeft: "0px"
                        })) : (a = f.offset().top + f.outerHeight() + d,
                        c = f.offset().left + g / 2 - n / 2,
                        e = b(c, a, n, m),
                        o = "+10px",
                        i.css({
                            marginLeft: n / 2 - i.width() / 2
                        })),
                        h.css({
                            top: e.y,
                            left: e.x
                        }),
                        q = n / 8,
                        8 > q && (q = 8),
                        ("right" === l || "left" === l) && (q = n / 10,
                        6 > q && (q = 6)),
                        h.velocity({
                            marginTop: o,
                            marginLeft: p
                        }, {
                            duration: 350,
                            queue: !1
                        }).velocity({
                            opacity: 1
                        }, {
                            duration: 300,
                            delay: 50,
                            queue: !1
                        }),
                        i.css({
                            display: "block"
                        }).velocity({
                            opacity: 1
                        }, {
                            duration: 55,
                            delay: 0,
                            queue: !1
                        }).velocity({
                            scale: q
                        }, {
                            duration: 300,
                            delay: 0,
                            queue: !1,
                            easing: "easeInOutQuad"
                        })
                    }, e)
                },
                "mouseleave.tooltip": function() {
                    k = !1,
                    clearTimeout(j),
                    setTimeout(function() {
                        1 != k && (h.velocity({
                            opacity: 0,
                            marginTop: 0,
                            marginLeft: 0
                        }, {
                            duration: 225,
                            queue: !1
                        }),
                        i.velocity({
                            opacity: 0,
                            scale: 1
                        }, {
                            duration: 225,
                            queue: !1,
                            complete: function() {
                                i.css("display", "none"),
                                h.css("display", "none"),
                                k = !1
                            }
                        }))
                    }, 225)
                }
            })
        }))
    }
    ;
    var b = function(b, c, d, e) {
        var f = b
          , g = c;
        return 0 > f ? f = 4 : f + d > window.innerWidth && (f -= f + d - window.innerWidth),
        0 > g ? g = 4 : g + e > window.innerHeight + a(window).scrollTop && (g -= g + e - window.innerHeight),
        {
            x: f,
            y: g
        }
    };
    a(document).ready(function() {
        a(".tooltipped").tooltip()
    })
}(jQuery),
function(a) {
    "use strict";
    function b(a) {
        return null !== a && a === a.window
    }
    function c(a) {
        return b(a) ? a : 9 === a.nodeType && a.defaultView
    }
    function d(a) {
        var b, d, e = {
            top: 0,
            left: 0
        }, f = a && a.ownerDocument;
        return b = f.documentElement,
        "undefined" != typeof a.getBoundingClientRect && (e = a.getBoundingClientRect()),
        d = c(f),
        {
            top: e.top + d.pageYOffset - b.clientTop,
            left: e.left + d.pageXOffset - b.clientLeft
        }
    }
    function e(a) {
        var b = "";
        for (var c in a)
            a.hasOwnProperty(c) && (b += c + ":" + a[c] + ";");
        return b
    }
    function f(a) {
        if (k.allowEvent(a) === !1)
            return null;
        for (var b = null, c = a.target || a.srcElement; null !== c.parentElement; ) {
            if (!(c instanceof SVGElement || -1 === c.className.indexOf("waves-effect"))) {
                b = c;
                break
            }
            if (c.classList.contains("waves-effect")) {
                b = c;
                break
            }
            c = c.parentElement
        }
        return b
    }
    function g(b) {
        var c = f(b);
        null !== c && (j.show(b, c),
        "ontouchstart"in a && (c.addEventListener("touchend", j.hide, !1),
        c.addEventListener("touchcancel", j.hide, !1)),
        c.addEventListener("mouseup", j.hide, !1),
        c.addEventListener("mouseleave", j.hide, !1))
    }
    var h = h || {}
      , i = document.querySelectorAll.bind(document)
      , j = {
        duration: 750,
        show: function(a, b) {
            if (2 === a.button)
                return !1;
            var c = b || this
              , f = document.createElement("div");
            f.className = "waves-ripple",
            c.appendChild(f);
            var g = d(c)
              , h = a.pageY - g.top
              , i = a.pageX - g.left
              , k = "scale(" + c.clientWidth / 100 * 10 + ")";
            "touches"in a && (h = a.touches[0].pageY - g.top,
            i = a.touches[0].pageX - g.left),
            f.setAttribute("data-hold", Date.now()),
            f.setAttribute("data-scale", k),
            f.setAttribute("data-x", i),
            f.setAttribute("data-y", h);
            var l = {
                top: h + "px",
                left: i + "px"
            };
            f.className = f.className + " waves-notransition",
            f.setAttribute("style", e(l)),
            f.className = f.className.replace("waves-notransition", ""),
            l["-webkit-transform"] = k,
            l["-moz-transform"] = k,
            l["-ms-transform"] = k,
            l["-o-transform"] = k,
            l.transform = k,
            l.opacity = "1",
            l["-webkit-transition-duration"] = j.duration + "ms",
            l["-moz-transition-duration"] = j.duration + "ms",
            l["-o-transition-duration"] = j.duration + "ms",
            l["transition-duration"] = j.duration + "ms",
            l["-webkit-transition-timing-function"] = "cubic-bezier(0.250, 0.460, 0.450, 0.940)",
            l["-moz-transition-timing-function"] = "cubic-bezier(0.250, 0.460, 0.450, 0.940)",
            l["-o-transition-timing-function"] = "cubic-bezier(0.250, 0.460, 0.450, 0.940)",
            l["transition-timing-function"] = "cubic-bezier(0.250, 0.460, 0.450, 0.940)",
            f.setAttribute("style", e(l))
        },
        hide: function(a) {
            k.touchup(a);
            var b = this
              , c = (1.4 * b.clientWidth,
            null)
              , d = b.getElementsByClassName("waves-ripple");
            if (!(d.length > 0))
                return !1;
            c = d[d.length - 1];
            var f = c.getAttribute("data-x")
              , g = c.getAttribute("data-y")
              , h = c.getAttribute("data-scale")
              , i = Date.now() - Number(c.getAttribute("data-hold"))
              , l = 350 - i;
            0 > l && (l = 0),
            setTimeout(function() {
                var a = {
                    top: g + "px",
                    left: f + "px",
                    opacity: "0",
                    "-webkit-transition-duration": j.duration + "ms",
                    "-moz-transition-duration": j.duration + "ms",
                    "-o-transition-duration": j.duration + "ms",
                    "transition-duration": j.duration + "ms",
                    "-webkit-transform": h,
                    "-moz-transform": h,
                    "-ms-transform": h,
                    "-o-transform": h,
                    transform: h
                };
                c.setAttribute("style", e(a)),
                setTimeout(function() {
                    try {
                        b.removeChild(c)
                    } catch (a) {
                        return !1
                    }
                }, j.duration)
            }, l)
        },
        wrapInput: function(a) {
            for (var b = 0; b < a.length; b++) {
                var c = a[b];
                if ("input" === c.tagName.toLowerCase()) {
                    var d = c.parentNode;
                    if ("i" === d.tagName.toLowerCase() && -1 !== d.className.indexOf("waves-effect"))
                        continue;
                    var e = document.createElement("i");
                    e.className = c.className + " waves-input-wrapper";
                    var f = c.getAttribute("style");
                    f || (f = ""),
                    e.setAttribute("style", f),
                    c.className = "waves-button-input",
                    c.removeAttribute("style"),
                    d.replaceChild(e, c),
                    e.appendChild(c)
                }
            }
        }
    }
      , k = {
        touches: 0,
        allowEvent: function(a) {
            var b = !0;
            return "touchstart" === a.type ? k.touches += 1 : "touchend" === a.type || "touchcancel" === a.type ? setTimeout(function() {
                k.touches > 0 && (k.touches -= 1)
            }, 500) : "mousedown" === a.type && k.touches > 0 && (b = !1),
            b
        },
        touchup: function(a) {
            k.allowEvent(a)
        }
    };
    h.displayEffect = function(b) {
        b = b || {},
        "duration"in b && (j.duration = b.duration),
        j.wrapInput(i(".waves-effect")),
        "ontouchstart"in a && document.body.addEventListener("touchstart", g, !1),
        document.body.addEventListener("mousedown", g, !1)
    }
    ,
    h.attach = function(b) {
        "input" === b.tagName.toLowerCase() && (j.wrapInput([b]),
        b = b.parentElement),
        "ontouchstart"in a && b.addEventListener("touchstart", g, !1),
        b.addEventListener("mousedown", g, !1)
    }
    ,
    a.Waves = h,
    document.addEventListener("DOMContentLoaded", function() {
        h.displayEffect()
    }, !1)
}(window),
Materialize.toast = function(a, b, c, d) {
    function e(a) {
        var b = document.createElement("div");
        if (b.classList.add("toast"),
        c)
            for (var e = c.split(" "), f = 0, g = e.length; g > f; f++)
                b.classList.add(e[f]);
        ("object" == typeof HTMLElement ? a instanceof HTMLElement : a && "object" == typeof a && null !== a && 1 === a.nodeType && "string" == typeof a.nodeName) ? b.appendChild(a) : a instanceof jQuery ? b.appendChild(a[0]) : b.innerHTML = a;
        var h = new Hammer(b,{
            prevent_default: !1
        });
        return h.on("pan", function(a) {
            var c = a.deltaX
              , d = 80;
            b.classList.contains("panning") || b.classList.add("panning");
            var e = 1 - Math.abs(c / d);
            0 > e && (e = 0),
            Vel(b, {
                left: c,
                opacity: e
            }, {
                duration: 50,
                queue: !1,
                easing: "easeOutQuad"
            })
        }),
        h.on("panend", function(a) {
            var c = a.deltaX
              , e = 80;
            Math.abs(c) > e ? Vel(b, {
                marginTop: "-40px"
            }, {
                duration: 375,
                easing: "easeOutExpo",
                queue: !1,
                complete: function() {
                    "function" == typeof d && d(),
                    b.parentNode.removeChild(b)
                }
            }) : (b.classList.remove("panning"),
            Vel(b, {
                left: 0,
                opacity: 1
            }, {
                duration: 300,
                easing: "easeOutExpo",
                queue: !1
            }))
        }),
        b
    }
    c = c || "";
    var f = document.getElementById("toast-container");
    null === f && (f = document.createElement("div"),
    f.id = "toast-container",
    document.body.appendChild(f));
    var g = e(a);
    a && f.appendChild(g),
    g.style.top = "35px",
    g.style.opacity = 0,
    Vel(g, {
        top: "0px",
        opacity: 1
    }, {
        duration: 300,
        easing: "easeOutCubic",
        queue: !1
    });
    var h = b
      , i = setInterval(function() {
        null === g.parentNode && window.clearInterval(i),
        g.classList.contains("panning") || (h -= 20),
        0 >= h && (Vel(g, {
            opacity: 0,
            marginTop: "-40px"
        }, {
            duration: 375,
            easing: "easeOutExpo",
            queue: !1,
            complete: function() {
                "function" == typeof d && d(),
                this[0].parentNode.removeChild(this[0])
            }
        }),
        window.clearInterval(i))
    }, 20)
}
,
function(a) {
    var b = {
        init: function(b) {
            var c = {
                menuWidth: 240,
                edge: "left",
                closeOnClick: !1
            };
            b = a.extend(c, b),
            a(this).each(function() {
                function c(c) {
                    g = !1,
                    h = !1,
                    a("body").css("overflow", ""),
                    a("#sidenav-overlay").velocity({
                        opacity: 0
                    }, {
                        duration: 200,
                        queue: !1,
                        easing: "easeOutQuad",
                        complete: function() {
                            a(this).remove()
                        }
                    }),
                    "left" === b.edge ? (f.css({
                        width: "",
                        right: "",
                        left: "0"
                    }),
                    e.velocity({
                        left: -1 * (b.menuWidth + 10)
                    }, {
                        duration: 200,
                        queue: !1,
                        easing: "easeOutCubic",
                        complete: function() {
                            c === !0 && (e.removeAttr("style"),
                            e.css("width", b.menuWidth))
                        }
                    })) : (f.css({
                        width: "",
                        right: "0",
                        left: ""
                    }),
                    e.velocity({
                        right: -1 * (b.menuWidth + 10)
                    }, {
                        duration: 200,
                        queue: !1,
                        easing: "easeOutCubic",
                        complete: function() {
                            c === !0 && (e.removeAttr("style"),
                            e.css("width", b.menuWidth))
                        }
                    }))
                }
                var d = a(this)
                  , e = a("#" + d.attr("data-activates"));
                240 != b.menuWidth && e.css("width", b.menuWidth);
                var f = a('<div class="drag-target"></div>');
                a("body").append(f),
                "left" == b.edge ? (e.css("left", -1 * (b.menuWidth + 10)),
                f.css({
                    left: 0
                })) : (e.addClass("right-aligned").css("right", -1 * (b.menuWidth + 10)).css("left", ""),
                f.css({
                    right: 0
                })),
                e.hasClass("fixed") && window.innerWidth > 992 && e.css("left", 0),
                e.hasClass("fixed") && a(window).resize(function() {
                    window.innerWidth > 992 ? 0 !== a("#sidenav-overlay").css("opacity") && h ? c(!0) : (e.removeAttr("style"),
                    e.css("width", b.menuWidth)) : h === !1 && ("left" === b.edge ? e.css("left", -1 * (b.menuWidth + 10)) : e.css("right", -1 * (b.menuWidth + 10)))
                }),
                b.closeOnClick === !0 && e.on("click.itemclick", "a:not(.collapsible-header)", function() {
                    c()
                });
                var g = !1
                  , h = !1;
                f.on("click", function() {
                    c()
                }),
                f.hammer({
                    prevent_default: !1
                }).bind("pan", function(d) {
                    if ("touch" == d.gesture.pointerType) {
                        var f = (d.gesture.direction,
                        d.gesture.center.x);
                        d.gesture.center.y,
                        d.gesture.velocityX;
                        if (a("body").css("overflow", "hidden"),
                        0 === a("#sidenav-overlay").length) {
                            var g = a('<div id="sidenav-overlay"></div>');
                            g.css("opacity", 0).click(function() {
                                c()
                            }),
                            a("body").append(g)
                        }
                        if ("left" === b.edge && (f > b.menuWidth ? f = b.menuWidth : 0 > f && (f = 0)),
                        "left" === b.edge)
                            f < b.menuWidth / 2 ? h = !1 : f >= b.menuWidth / 2 && (h = !0),
                            e.css("left", f - b.menuWidth);
                        else {
                            f < window.innerWidth - b.menuWidth / 2 ? h = !0 : f >= window.innerWidth - b.menuWidth / 2 && (h = !1);
                            var i = -1 * (f - b.menuWidth / 2);
                            i > 0 && (i = 0),
                            e.css("right", i)
                        }
                        var j;
                        "left" === b.edge ? (j = f / b.menuWidth,
                        a("#sidenav-overlay").velocity({
                            opacity: j
                        }, {
                            duration: 50,
                            queue: !1,
                            easing: "easeOutQuad"
                        })) : (j = Math.abs((f - window.innerWidth) / b.menuWidth),
                        a("#sidenav-overlay").velocity({
                            opacity: j
                        }, {
                            duration: 50,
                            queue: !1,
                            easing: "easeOutQuad"
                        }))
                    }
                }).bind("panend", function(c) {
                    if ("touch" == c.gesture.pointerType) {
                        var d = c.gesture.velocityX;
                        g = !1,
                        "left" === b.edge ? h && .3 >= d || -.5 > d ? (e.velocity({
                            left: 0
                        }, {
                            duration: 300,
                            queue: !1,
                            easing: "easeOutQuad"
                        }),
                        a("#sidenav-overlay").velocity({
                            opacity: 1
                        }, {
                            duration: 50,
                            queue: !1,
                            easing: "easeOutQuad"
                        }),
                        f.css({
                            width: "50%",
                            right: 0,
                            left: ""
                        })) : (!h || d > .3) && (a("body").css("overflow", ""),
                        e.velocity({
                            left: -1 * (b.menuWidth + 10)
                        }, {
                            duration: 200,
                            queue: !1,
                            easing: "easeOutQuad"
                        }),
                        a("#sidenav-overlay").velocity({
                            opacity: 0
                        }, {
                            duration: 200,
                            queue: !1,
                            easing: "easeOutQuad",
                            complete: function() {
                                a(this).remove()
                            }
                        }),
                        f.css({
                            width: "10px",
                            right: "",
                            left: 0
                        })) : h && d >= -.3 || d > .5 ? (e.velocity({
                            right: 0
                        }, {
                            duration: 300,
                            queue: !1,
                            easing: "easeOutQuad"
                        }),
                        a("#sidenav-overlay").velocity({
                            opacity: 1
                        }, {
                            duration: 50,
                            queue: !1,
                            easing: "easeOutQuad"
                        }),
                        f.css({
                            width: "50%",
                            right: "",
                            left: 0
                        })) : (!h || -.3 > d) && (a("body").css("overflow", ""),
                        e.velocity({
                            right: -1 * (b.menuWidth + 10)
                        }, {
                            duration: 200,
                            queue: !1,
                            easing: "easeOutQuad"
                        }),
                        a("#sidenav-overlay").velocity({
                            opacity: 0
                        }, {
                            duration: 200,
                            queue: !1,
                            easing: "easeOutQuad",
                            complete: function() {
                                a(this).remove()
                            }
                        }),
                        f.css({
                            width: "10px",
                            right: 0,
                            left: ""
                        }))
                    }
                }),
                d.click(function() {
                    if (h === !0)
                        h = !1,
                        g = !1,
                        c();
                    else {
                        a("body").css("overflow", "hidden"),
                        a("body").append(f),
                        "left" === b.edge ? (f.css({
                            width: "50%",
                            right: 0,
                            left: ""
                        }),
                        e.velocity({
                            left: 0
                        }, {
                            duration: 300,
                            queue: !1,
                            easing: "easeOutQuad"
                        })) : (f.css({
                            width: "50%",
                            right: "",
                            left: 0
                        }),
                        e.velocity({
                            right: 0
                        }, {
                            duration: 300,
                            queue: !1,
                            easing: "easeOutQuad"
                        }),
                        e.css("left", ""));
                        var d = a('<div id="sidenav-overlay"></div>');
                        d.css("opacity", 0).click(function() {
                            h = !1,
                            g = !1,
                            c(),
                            d.velocity({
                                opacity: 0
                            }, {
                                duration: 300,
                                queue: !1,
                                easing: "easeOutQuad",
                                complete: function() {
                                    a(this).remove()
                                }
                            })
                        }),
                        a("body").append(d),
                        d.velocity({
                            opacity: 1
                        }, {
                            duration: 300,
                            queue: !1,
                            easing: "easeOutQuad",
                            complete: function() {
                                h = !0,
                                g = !1
                            }
                        })
                    }
                    return !1
                })
            })
        },
        show: function() {
            this.trigger("click")
        },
        hide: function() {
            a("#sidenav-overlay").trigger("click")
        }
    };
    a.fn.sideNav = function(c) {
        return b[c] ? b[c].apply(this, Array.prototype.slice.call(arguments, 1)) : "object" != typeof c && c ? void a.error("Method " + c + " does not exist on jQuery.sideNav") : b.init.apply(this, arguments)
    }
}(jQuery),
function(a) {
    function b(b, c, d, e) {
        var f = a();
        return a.each(g, function(a, g) {
            if (g.height() > 0) {
                var h = g.offset().top
                  , i = g.offset().left
                  , j = i + g.width()
                  , k = h + g.height()
                  , l = !(i > c || e > j || h > d || b > k);
                l && f.push(g)
            }
        }),
        f
    }
    function c() {
        ++j;
        var c = f.scrollTop()
          , d = f.scrollLeft()
          , e = d + f.width()
          , g = c + f.height()
          , i = b(c + k.top + 200, e + k.right, g + k.bottom, d + k.left);
        a.each(i, function(a, b) {
            var c = b.data("scrollSpy:ticks");
            "number" != typeof c && b.triggerHandler("scrollSpy:enter"),
            b.data("scrollSpy:ticks", j)
        }),
        a.each(h, function(a, b) {
            var c = b.data("scrollSpy:ticks");
            "number" == typeof c && c !== j && (b.triggerHandler("scrollSpy:exit"),
            b.data("scrollSpy:ticks", null))
        }),
        h = i
    }
    function d() {
        f.trigger("scrollSpy:winSize")
    }
    function e(a, b, c) {
        var d, e, f, g = null, h = 0;
        c || (c = {});
        var i = function() {
            h = c.leading === !1 ? 0 : l(),
            g = null,
            f = a.apply(d, e),
            d = e = null
        };
        return function() {
            var j = l();
            h || c.leading !== !1 || (h = j);
            var k = b - (j - h);
            return d = this,
            e = arguments,
            0 >= k ? (clearTimeout(g),
            g = null,
            h = j,
            f = a.apply(d, e),
            d = e = null) : g || c.trailing === !1 || (g = setTimeout(i, k)),
            f
        }
    }
    var f = a(window)
      , g = []
      , h = []
      , i = !1
      , j = 0
      , k = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    }
      , l = Date.now || function() {
        return (new Date).getTime()
    }
    ;
    a.scrollSpy = function(b, d) {
        var h = [];
        b = a(b),
        b.each(function(b, c) {
            g.push(a(c)),
            a(c).data("scrollSpy:id", b),
            a("a[href=#" + a(c).attr("id") + "]").click(function(b) {
                b.preventDefault();
                var c = a(this.hash).offset().top + 1;
                a("html, body").animate({
                    scrollTop: c - 200
                }, {
                    duration: 400,
                    queue: !1,
                    easing: "easeOutCubic"
                })
            })
        }),
        d = d || {
            throttle: 100
        },
        k.top = d.offsetTop || 0,
        k.right = d.offsetRight || 0,
        k.bottom = d.offsetBottom || 0,
        k.left = d.offsetLeft || 0;
        var j = e(c, d.throttle || 100)
          , l = function() {
            a(document).ready(j)
        };
        return i || (f.on("scroll", l),
        f.on("resize", l),
        i = !0),
        setTimeout(l, 0),
        b.on("scrollSpy:enter", function() {
            h = a.grep(h, function(a) {
                return 0 != a.height()
            });
            var b = a(this);
            h[0] ? (a("a[href=#" + h[0].attr("id") + "]").removeClass("active"),
            b.data("scrollSpy:id") < h[0].data("scrollSpy:id") ? h.unshift(a(this)) : h.push(a(this))) : h.push(a(this)),
            a("a[href=#" + h[0].attr("id") + "]").addClass("active")
        }),
        b.on("scrollSpy:exit", function() {
            if (h = a.grep(h, function(a) {
                return 0 != a.height()
            }),
            h[0]) {
                a("a[href=#" + h[0].attr("id") + "]").removeClass("active");
                var b = a(this);
                h = a.grep(h, function(a) {
                    return a.attr("id") != b.attr("id")
                }),
                h[0] && a("a[href=#" + h[0].attr("id") + "]").addClass("active")
            }
        }),
        b
    }
    ,
    a.winSizeSpy = function(b) {
        return a.winSizeSpy = function() {
            return f
        }
        ,
        b = b || {
            throttle: 100
        },
        f.on("resize", e(d, b.throttle || 100))
    }
    ,
    a.fn.scrollSpy = function(b) {
        return a.scrollSpy(a(this), b)
    }
}(jQuery),
function(a) {
    a(document).ready(function() {
        function b(b) {
            var c = b.css("font-family")
              , e = b.css("font-size");
            e && d.css("font-size", e),
            c && d.css("font-family", c),
            "off" === b.attr("wrap") && d.css("overflow-wrap", "normal").css("white-space", "pre"),
            d.text(b.val() + "\n");
            var f = d.html().replace(/\n/g, "<br>");
            d.html(f),
            b.is(":visible") ? d.css("width", b.width()) : d.css("width", a(window).width() / 2),
            b.css("height", d.height())
        }
        Materialize.updateTextFields = function() {
            var b = "input[type=text], input[type=password], input[type=email], input[type=url], input[type=tel], input[type=number], input[type=search], textarea";
            a(b).each(function(b, c) {
                a(c).val().length > 0 || c.autofocus || void 0 !== a(this).attr("placeholder") || a(c)[0].validity.badInput === !0 ? a(this).siblings("label, i").addClass("active") : a(this).siblings("label, i").removeClass("active")
            })
        }
        ;
        var c = "input[type=text], input[type=password], input[type=email], input[type=url], input[type=tel], input[type=number], input[type=search], textarea";
        a(document).on("change", c, function() {
            (0 !== a(this).val().length || void 0 !== a(this).attr("placeholder")) && a(this).siblings("label").addClass("active"),
            validate_field(a(this))
        }),
        a(document).ready(function() {
            Materialize.updateTextFields()
        }),
        a(document).on("reset", function(b) {
            var d = a(b.target);
            d.is("form") && (d.find(c).removeClass("valid").removeClass("invalid"),
            d.find(c).each(function() {
                "" === a(this).attr("value") && a(this).siblings("label, i").removeClass("active")
            }),
            d.find("select.initialized").each(function() {
                var a = d.find("option[selected]").text();
                d.siblings("input.select-dropdown").val(a)
            }))
        }),
        a(document).on("focus", c, function() {
            a(this).siblings("label, i").addClass("active")
        }),
        a(document).on("blur", c, function() {
            var b = a(this);
            0 === b.val().length && b[0].validity.badInput !== !0 && void 0 === b.attr("placeholder") && b.siblings("label, i").removeClass("active"),
            0 === b.val().length && b[0].validity.badInput !== !0 && void 0 !== b.attr("placeholder") && b.siblings("i").removeClass("active"),
            validate_field(b)
        }),
        window.validate_field = function(a) {
            var b = void 0 !== a.attr("length")
              , c = parseInt(a.attr("length"))
              , d = a.val().length;
            0 === a.val().length && a[0].validity.badInput === !1 ? a.hasClass("validate") && (a.removeClass("valid"),
            a.removeClass("invalid")) : a.hasClass("validate") && (a.is(":valid") && b && c >= d || a.is(":valid") && !b ? (a.removeClass("invalid"),
            a.addClass("valid")) : (a.removeClass("valid"),
            a.addClass("invalid")))
        }
        ;
        var d = a(".hiddendiv").first();
        d.length || (d = a('<div class="hiddendiv common"></div>'),
        a("body").append(d));
        var e = ".materialize-textarea";
        a(e).each(function() {
            var c = a(this);
            c.val().length && b(c)
        }),
        a("body").on("keyup keydown autoresize", e, function() {
            b(a(this))
        }),
        a(document).on("change", '.file-field input[type="file"]', function() {
            for (var b = a(this).closest(".file-field"), c = b.find("input.file-path"), d = a(this)[0].files, e = [], f = 0; f < d.length; f++)
                e.push(d[f].name);
            c.val(e.join(", ")),
            c.trigger("change")
        });
        var f, g = "input[type=range]", h = !1;
        a(g).each(function() {
            var b = a('<span class="thumb"><span class="value"></span></span>');
            a(this).after(b)
        });
        var i = ".range-field";
        a(document).on("change", g, function(b) {
            var c = a(this).siblings(".thumb");
            c.find(".value").html(a(this).val())
        }),
        a(document).on("input mousedown touchstart", g, function(b) {
            var c = a(this).siblings(".thumb")
              , d = a(this).outerWidth();
            c.length <= 0 && (c = a('<span class="thumb"><span class="value"></span></span>'),
            a(this).after(c)),
            c.find(".value").html(a(this).val()),
            h = !0,
            a(this).addClass("active"),
            c.hasClass("active") || c.velocity({
                height: "30px",
                width: "30px",
                top: "-20px",
                marginLeft: "-15px"
            }, {
                duration: 300,
                easing: "easeOutExpo"
            }),
            "input" !== b.type && (f = void 0 === b.pageX || null === b.pageX ? b.originalEvent.touches[0].pageX - a(this).offset().left : b.pageX - a(this).offset().left,
            0 > f ? f = 0 : f > d && (f = d),
            c.addClass("active").css("left", f)),
            c.find(".value").html(a(this).val())
        }),
        a(document).on("mouseup touchend", i, function() {
            h = !1,
            a(this).removeClass("active")
        }),
        a(document).on("mousemove touchmove", i, function(b) {
            var c, d = a(this).children(".thumb");
            if (h) {
                d.hasClass("active") || d.velocity({
                    height: "30px",
                    width: "30px",
                    top: "-20px",
                    marginLeft: "-15px"
                }, {
                    duration: 300,
                    easing: "easeOutExpo"
                }),
                c = void 0 === b.pageX || null === b.pageX ? b.originalEvent.touches[0].pageX - a(this).offset().left : b.pageX - a(this).offset().left;
                var e = a(this).outerWidth();
                0 > c ? c = 0 : c > e && (c = e),
                d.addClass("active").css("left", c),
                d.find(".value").html(d.siblings(g).val())
            }
        }),
        a(document).on("mouseout touchleave", i, function() {
            if (!h) {
                var b = a(this).children(".thumb");
                b.hasClass("active") && b.velocity({
                    height: "0",
                    width: "0",
                    top: "10px",
                    marginLeft: "-6px"
                }, {
                    duration: 100
                }),
                b.removeClass("active")
            }
        })
    }),
    a.fn.material_select = function(b) {
        function c(a, b, c) {
            var e = a.indexOf(b)
              , f = -1 === e;
            return f ? a.push(b) : a.splice(e, 1),
            c.siblings("ul.dropdown-content").find("li").eq(b).toggleClass("active"),
            c.find("option").eq(b).prop("selected", f),
            d(a, c),
            f
        }
        function d(a, b) {
            for (var c = "", d = 0, e = a.length; e > d; d++) {
                var f = b.find("option").eq(a[d]).text();
                c += 0 === d ? f : ", " + f
            }
            "" === c && (c = b.find("option:disabled").eq(0).text()),
            b.siblings("input.select-dropdown").val(c)
        }
        a(this).each(function() {
            var d = a(this);
            if (!d.hasClass("browser-default")) {
                var e = d.attr("multiple") ? !0 : !1
                  , f = d.data("select-id");
                if (f && (d.parent().find("span.caret").remove(),
                d.parent().find("input").remove(),
                d.unwrap(),
                a("ul#select-options-" + f).remove()),
                "destroy" === b)
                    return void d.data("select-id", null).removeClass("initialized");
                var g = Materialize.guid();
                d.data("select-id", g);
                var h = a('<div class="select-wrapper"></div>');
                h.addClass(d.attr("class"));
                var i = a('<ul id="select-options-' + g + '" class="dropdown-content select-dropdown ' + (e ? "multiple-select-dropdown" : "") + '"></ul>')
                  , j = d.children("option, optgroup")
                  , k = []
                  , l = !1
                  , m = d.find("option:selected").html() || d.find("option:first").html() || ""
                  , n = function(b, c, d) {
                    var e = c.is(":disabled") ? "disabled " : ""
                      , f = c.data("icon")
                      , g = c.attr("class");
                    if (f) {
                        var h = "";
                        return g && (h = ' class="' + g + '"'),
                        "multiple" === d ? i.append(a('<li class="' + e + '"><img src="' + f + '"' + h + '><span><input type="checkbox"' + e + "/><label></label>" + c.html() + "</span></li>")) : i.append(a('<li class="' + e + '"><img src="' + f + '"' + h + "><span>" + c.html() + "</span></li>")),
                        !0
                    }
                    "multiple" === d ? i.append(a('<li class="' + e + '"><span><input type="checkbox"' + e + "/><label></label>" + c.html() + "</span></li>")) : i.append(a('<li class="' + e + '"><span>' + c.html() + "</span></li>"))
                };
                j.length && j.each(function() {
                    if (a(this).is("option"))
                        e ? n(d, a(this), "multiple") : n(d, a(this));
                    else if (a(this).is("optgroup")) {
                        var b = a(this).children("option");
                        i.append(a('<li class="optgroup"><span>' + a(this).attr("label") + "</span></li>")),
                        b.each(function() {
                            n(d, a(this))
                        })
                    }
                }),
                i.find("li:not(.optgroup)").each(function(f) {
                    a(this).click(function(g) {
                        if (!a(this).hasClass("disabled") && !a(this).hasClass("optgroup")) {
                            var h = !0;
                            e ? (a('input[type="checkbox"]', this).prop("checked", function(a, b) {
                                return !b
                            }),
                            h = c(k, a(this).index(), d),
                            q.trigger("focus")) : (i.find("li").removeClass("active"),
                            a(this).toggleClass("active"),
                            q.val(a(this).text())),
                            activateOption(i, a(this)),
                            d.find("option").eq(f).prop("selected", h),
                            d.trigger("change"),
                            "undefined" != typeof b && b()
                        }
                        g.stopPropagation()
                    })
                }),
                d.wrap(h);
                var o = a('<span class="caret">&#9660;</span>');
                d.is(":disabled") && o.addClass("disabled");
                var p = m.replace(/"/g, "&quot;")
                  , q = a('<input type="text" class="select-dropdown" readonly="true" ' + (d.is(":disabled") ? "disabled" : "") + ' data-activates="select-options-' + g + '" value="' + p + '"/>');
                d.before(q),
                q.before(o),
                q.after(i),
                d.is(":disabled") || q.dropdown({
                    hover: !1,
                    closeOnClick: !1
                }),
                d.attr("tabindex") && a(q[0]).attr("tabindex", d.attr("tabindex")),
                d.addClass("initialized"),
                q.on({
                    focus: function() {
                        if (a("ul.select-dropdown").not(i[0]).is(":visible") && a("input.select-dropdown").trigger("close"),
                        !i.is(":visible")) {
                            a(this).trigger("open", ["focus"]);
                            var b = a(this).val()
                              , c = i.find("li").filter(function() {
                                return a(this).text().toLowerCase() === b.toLowerCase()
                            })[0];
                            activateOption(i, c)
                        }
                    },
                    click: function(a) {
                        a.stopPropagation()
                    }
                }),
                q.on("blur", function() {
                    e || a(this).trigger("close"),
                    i.find("li.selected").removeClass("selected")
                }),
                i.hover(function() {
                    l = !0
                }, function() {
                    l = !1
                }),
                a(window).on({
                    click: function() {
                        e && (l || q.trigger("close"))
                    }
                }),
                e && d.find("option:selected:not(:disabled)").each(function() {
                    var b = a(this).index();
                    c(k, b, d),
                    i.find("li").eq(b).find(":checkbox").prop("checked", !0)
                }),
                activateOption = function(b, c) {
                    if (c) {
                        b.find("li.selected").removeClass("selected");
                        var d = a(c);
                        d.addClass("selected"),
                        i.scrollTo(d)
                    }
                }
                ;
                var r = []
                  , s = function(b) {
                    if (9 == b.which)
                        return void q.trigger("close");
                    if (40 == b.which && !i.is(":visible"))
                        return void q.trigger("open");
                    if (13 != b.which || i.is(":visible")) {
                        b.preventDefault();
                        var c = String.fromCharCode(b.which).toLowerCase()
                          , d = [9, 13, 27, 38, 40];
                        if (c && -1 === d.indexOf(b.which)) {
                            r.push(c);
                            var f = r.join("")
                              , g = i.find("li").filter(function() {
                                return 0 === a(this).text().toLowerCase().indexOf(f)
                            })[0];
                            g && activateOption(i, g)
                        }
                        if (13 == b.which) {
                            var h = i.find("li.selected:not(.disabled)")[0];
                            h && (a(h).trigger("click"),
                            e || q.trigger("close"))
                        }
                        40 == b.which && (g = i.find("li.selected").length ? i.find("li.selected").next("li:not(.disabled)")[0] : i.find("li:not(.disabled)")[0],
                        activateOption(i, g)),
                        27 == b.which && q.trigger("close"),
                        38 == b.which && (g = i.find("li.selected").prev("li:not(.disabled)")[0],
                        g && activateOption(i, g)),
                        setTimeout(function() {
                            r = []
                        }, 1e3)
                    }
                };
                q.on("keydown", s)
            }
        })
    }
}(jQuery),
function(a) {
    var b = {
        init: function(b) {
            var c = {
                indicators: !0,
                height: 400,
                transition: 500,
                interval: 6e3
            };
            return b = a.extend(c, b),
            this.each(function() {
                function c(a, b) {
                    a.hasClass("center-align") ? a.velocity({
                        opacity: 0,
                        translateY: -100
                    }, {
                        duration: b,
                        queue: !1
                    }) : a.hasClass("right-align") ? a.velocity({
                        opacity: 0,
                        translateX: 100
                    }, {
                        duration: b,
                        queue: !1
                    }) : a.hasClass("left-align") && a.velocity({
                        opacity: 0,
                        translateX: -100
                    }, {
                        duration: b,
                        queue: !1
                    })
                }
                function d(a) {
                    a >= j.length ? a = 0 : 0 > a && (a = j.length - 1),
                    k = i.find(".active").index(),
                    k != a && (e = j.eq(k),
                    $caption = e.find(".caption"),
                    e.removeClass("active"),
                    e.velocity({
                        opacity: 0
                    }, {
                        duration: b.transition,
                        queue: !1,
                        easing: "easeOutQuad",
                        complete: function() {
                            j.not(".active").velocity({
                                opacity: 0,
                                translateX: 0,
                                translateY: 0
                            }, {
                                duration: 0,
                                queue: !1
                            })
                        }
                    }),
                    c($caption, b.transition),
                    b.indicators && f.eq(k).removeClass("active"),
                    j.eq(a).velocity({
                        opacity: 1
                    }, {
                        duration: b.transition,
                        queue: !1,
                        easing: "easeOutQuad"
                    }),
                    j.eq(a).find(".caption").velocity({
                        opacity: 1,
                        translateX: 0,
                        translateY: 0
                    }, {
                        duration: b.transition,
                        delay: b.transition,
                        queue: !1,
                        easing: "easeOutQuad"
                    }),
                    j.eq(a).addClass("active"),
                    b.indicators && f.eq(a).addClass("active"))
                }
                var e, f, g, h = a(this), i = h.find("ul.slides").first(), j = i.find("li"), k = i.find(".active").index();
                -1 != k && (e = j.eq(k)),
                h.hasClass("fullscreen") || (b.indicators ? h.height(b.height + 40) : h.height(b.height),
                i.height(b.height)),
                j.find(".caption").each(function() {
                    c(a(this), 0)
                }),
                j.find("img").each(function() {
                    var b = "data:image/gif;base64,R0lGODlhAQABAIABAP///wAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
                    a(this).attr("src") !== b && (a(this).css("background-image", "url(" + a(this).attr("src") + ")"),
                    a(this).attr("src", b))
                }),
                b.indicators && (f = a('<ul class="indicators"></ul>'),
                j.each(function(c) {
                    var e = a('<li class="indicator-item"></li>');
                    e.click(function() {
                        var c = i.parent()
                          , e = c.find(a(this)).index();
                        d(e),
                        clearInterval(g),
                        g = setInterval(function() {
                            k = i.find(".active").index(),
                            j.length == k + 1 ? k = 0 : k += 1,
                            d(k)
                        }, b.transition + b.interval)
                    }),
                    f.append(e)
                }),
                h.append(f),
                f = h.find("ul.indicators").find("li.indicator-item")),
                e ? e.show() : (j.first().addClass("active").velocity({
                    opacity: 1
                }, {
                    duration: b.transition,
                    queue: !1,
                    easing: "easeOutQuad"
                }),
                k = 0,
                e = j.eq(k),
                b.indicators && f.eq(k).addClass("active")),
                e.find("img").each(function() {
                    e.find(".caption").velocity({
                        opacity: 1,
                        translateX: 0,
                        translateY: 0
                    }, {
                        duration: b.transition,
                        queue: !1,
                        easing: "easeOutQuad"
                    })
                }),
                g = setInterval(function() {
                    k = i.find(".active").index(),
                    d(k + 1)
                }, b.transition + b.interval);
                var l = !1
                  , m = !1
                  , n = !1;
                h.hammer({
                    prevent_default: !1
                }).bind("pan", function(a) {
                    if ("touch" === a.gesture.pointerType) {
                        clearInterval(g);
                        var b = a.gesture.direction
                          , c = a.gesture.deltaX
                          , d = a.gesture.velocityX;
                        $curr_slide = i.find(".active"),
                        $curr_slide.velocity({
                            translateX: c
                        }, {
                            duration: 50,
                            queue: !1,
                            easing: "easeOutQuad"
                        }),
                        4 === b && (c > h.innerWidth() / 2 || -.65 > d) ? n = !0 : 2 === b && (c < -1 * h.innerWidth() / 2 || d > .65) && (m = !0);
                        var e;
                        m && (e = $curr_slide.next(),
                        0 === e.length && (e = j.first()),
                        e.velocity({
                            opacity: 1
                        }, {
                            duration: 300,
                            queue: !1,
                            easing: "easeOutQuad"
                        })),
                        n && (e = $curr_slide.prev(),
                        0 === e.length && (e = j.last()),
                        e.velocity({
                            opacity: 1
                        }, {
                            duration: 300,
                            queue: !1,
                            easing: "easeOutQuad"
                        }))
                    }
                }).bind("panend", function(a) {
                    "touch" === a.gesture.pointerType && ($curr_slide = i.find(".active"),
                    l = !1,
                    curr_index = i.find(".active").index(),
                    n || m ? m ? (d(curr_index + 1),
                    $curr_slide.velocity({
                        translateX: -1 * h.innerWidth()
                    }, {
                        duration: 300,
                        queue: !1,
                        easing: "easeOutQuad",
                        complete: function() {
                            $curr_slide.velocity({
                                opacity: 0,
                                translateX: 0
                            }, {
                                duration: 0,
                                queue: !1
                            })
                        }
                    })) : n && (d(curr_index - 1),
                    $curr_slide.velocity({
                        translateX: h.innerWidth()
                    }, {
                        duration: 300,
                        queue: !1,
                        easing: "easeOutQuad",
                        complete: function() {
                            $curr_slide.velocity({
                                opacity: 0,
                                translateX: 0
                            }, {
                                duration: 0,
                                queue: !1
                            })
                        }
                    })) : $curr_slide.velocity({
                        translateX: 0
                    }, {
                        duration: 300,
                        queue: !1,
                        easing: "easeOutQuad"
                    }),
                    m = !1,
                    n = !1,
                    clearInterval(g),
                    g = setInterval(function() {
                        k = i.find(".active").index(),
                        j.length == k + 1 ? k = 0 : k += 1,
                        d(k)
                    }, b.transition + b.interval))
                }),
                h.on("sliderPause", function() {
                    clearInterval(g)
                }),
                h.on("sliderStart", function() {
                    clearInterval(g),
                    g = setInterval(function() {
                        k = i.find(".active").index(),
                        j.length == k + 1 ? k = 0 : k += 1,
                        d(k)
                    }, b.transition + b.interval)
                }),
                h.on("sliderNext", function() {
                    k = i.find(".active").index(),
                    d(k + 1)
                }),
                h.on("sliderPrev", function() {
                    k = i.find(".active").index(),
                    d(k - 1)
                })
            })
        },
        pause: function() {
            a(this).trigger("sliderPause")
        },
        start: function() {
            a(this).trigger("sliderStart")
        },
        next: function() {
            a(this).trigger("sliderNext")
        },
        prev: function() {
            a(this).trigger("sliderPrev")
        }
    };
    a.fn.slider = function(c) {
        return b[c] ? b[c].apply(this, Array.prototype.slice.call(arguments, 1)) : "object" != typeof c && c ? void a.error("Method " + c + " does not exist on jQuery.tooltip") : b.init.apply(this, arguments)
    }
}(jQuery),
function(a) {
    a(document).ready(function() {
        a(document).on("click.card", ".card", function(b) {
            a(this).find("> .card-reveal").length && (a(b.target).is(a(".card-reveal .card-title")) || a(b.target).is(a(".card-reveal .card-title i")) ? a(this).find(".card-reveal").velocity({
                translateY: 0
            }, {
                duration: 225,
                queue: !1,
                easing: "easeInOutQuad",
                complete: function() {
                    a(this).css({
                        display: "none"
                    })
                }
            }) : (a(b.target).is(a(".card .activator")) || a(b.target).is(a(".card .activator i"))) && (a(b.target).closest(".card").css("overflow", "hidden"),
            a(this).find(".card-reveal").css({
                display: "block"
            }).velocity("stop", !1).velocity({
                translateY: "-100%"
            }, {
                duration: 300,
                queue: !1,
                easing: "easeInOutQuad"
            }))),
            a(".card-reveal").closest(".card").css("overflow", "hidden")
        })
    })
}(jQuery),
function(a) {
    a(document).ready(function() {
        a(document).on("click.chip", ".chip .material-icons", function(b) {
            a(this).parent().remove()
        })
    })
}(jQuery),
function(a) {
    a(document).ready(function() {
        a.fn.pushpin = function(b) {
            var c = {
                top: 0,
                bottom: 1 / 0,
                offset: 0
            };
            return b = a.extend(c, b),
            $index = 0,
            this.each(function() {
                function c(a) {
                    a.removeClass("pin-top"),
                    a.removeClass("pinned"),
                    a.removeClass("pin-bottom")
                }
                function d(d, e) {
                    d.each(function() {
                        b.top <= e && b.bottom >= e && !a(this).hasClass("pinned") && (c(a(this)),
                        a(this).css("top", b.offset),
                        a(this).addClass("pinned")),
                        e < b.top && !a(this).hasClass("pin-top") && (c(a(this)),
                        a(this).css("top", 0),
                        a(this).addClass("pin-top")),
                        e > b.bottom && !a(this).hasClass("pin-bottom") && (c(a(this)),
                        a(this).addClass("pin-bottom"),
                        a(this).css("top", b.bottom - g))
                    })
                }
                var e = Materialize.guid()
                  , f = a(this)
                  , g = a(this).offset().top;
                d(f, a(window).scrollTop()),
                a(window).on("scroll." + e, function() {
                    var c = a(window).scrollTop() + b.offset;
                    d(f, c)
                })
            })
        }
    })
}(jQuery),
function(a) {
    a(document).ready(function() {
        a.fn.reverse = [].reverse,
        a(document).on("mouseenter.fixedActionBtn", ".fixed-action-btn:not(.click-to-toggle)", function(c) {
            var d = a(this);
            b(d)
        }),
        a(document).on("mouseleave.fixedActionBtn", ".fixed-action-btn:not(.click-to-toggle)", function(b) {
            var d = a(this);
            c(d)
        }),
        a(document).on("click.fixedActionBtn", ".fixed-action-btn.click-to-toggle > a", function(d) {
            var e = a(this)
              , f = e.parent();
            f.hasClass("active") ? c(f) : b(f)
        })
    }),
    a.fn.extend({
        openFAB: function() {
            b(a(this))
        },
        closeFAB: function() {
            c(a(this))
        }
    });
    var b = function(b) {
        if ($this = b,
        $this.hasClass("active") === !1) {
            var c, d, e = $this.hasClass("horizontal");
            e === !0 ? d = 40 : c = 40,
            $this.addClass("active"),
            $this.find("ul .btn-floating").velocity({
                scaleY: ".4",
                scaleX: ".4",
                translateY: c + "px",
                translateX: d + "px"
            }, {
                duration: 0
            });
            var f = 0;
            $this.find("ul .btn-floating").reverse().each(function() {
                a(this).velocity({
                    opacity: "1",
                    scaleX: "1",
                    scaleY: "1",
                    translateY: "0",
                    translateX: "0"
                }, {
                    duration: 80,
                    delay: f
                }),
                f += 40
            })
        }
    }
      , c = function(a) {
        $this = a;
        var b, c, d = $this.hasClass("horizontal");
        d === !0 ? c = 40 : b = 40,
        $this.removeClass("active");
        $this.find("ul .btn-floating").velocity("stop", !0),
        $this.find("ul .btn-floating").velocity({
            opacity: "0",
            scaleX: ".4",
            scaleY: ".4",
            translateY: b + "px",
            translateX: c + "px"
        }, {
            duration: 80
        })
    }
}(jQuery),
function(a) {
    Materialize.fadeInImage = function(b) {
        var c = a(b);
        c.css({
            opacity: 0
        }),
        a(c).velocity({
            opacity: 1
        }, {
            duration: 650,
            queue: !1,
            easing: "easeOutSine"
        }),
        a(c).velocity({
            opacity: 1
        }, {
            duration: 1300,
            queue: !1,
            easing: "swing",
            step: function(b, c) {
                c.start = 100;
                var d = b / 100
                  , e = 150 - (100 - b) / 1.75;
                100 > e && (e = 100),
                b >= 0 && a(this).css({
                    "-webkit-filter": "grayscale(" + d + ")brightness(" + e + "%)",
                    filter: "grayscale(" + d + ")brightness(" + e + "%)"
                })
            }
        })
    }
    ,
    Materialize.showStaggeredList = function(b) {
        var c = 0;
        a(b).find("li").velocity({
            translateX: "-100px"
        }, {
            duration: 0
        }),
        a(b).find("li").each(function() {
            a(this).velocity({
                opacity: "1",
                translateX: "0"
            }, {
                duration: 800,
                delay: c,
                easing: [60, 10]
            }),
            c += 120
        })
    }
    ,
    a(document).ready(function() {
        var b = !1
          , c = !1;
        a(".dismissable").each(function() {
            a(this).hammer({
                prevent_default: !1
            }).bind("pan", function(d) {
                if ("touch" === d.gesture.pointerType) {
                    var e = a(this)
                      , f = d.gesture.direction
                      , g = d.gesture.deltaX
                      , h = d.gesture.velocityX;
                    e.velocity({
                        translateX: g
                    }, {
                        duration: 50,
                        queue: !1,
                        easing: "easeOutQuad"
                    }),
                    4 === f && (g > e.innerWidth() / 2 || -.75 > h) && (b = !0),
                    2 === f && (g < -1 * e.innerWidth() / 2 || h > .75) && (c = !0)
                }
            }).bind("panend", function(d) {
                if (Math.abs(d.gesture.deltaX) < a(this).innerWidth() / 2 && (c = !1,
                b = !1),
                "touch" === d.gesture.pointerType) {
                    var e = a(this);
                    if (b || c) {
                        var f;
                        f = b ? e.innerWidth() : -1 * e.innerWidth(),
                        e.velocity({
                            translateX: f
                        }, {
                            duration: 100,
                            queue: !1,
                            easing: "easeOutQuad",
                            complete: function() {
                                e.css("border", "none"),
                                e.velocity({
                                    height: 0,
                                    padding: 0
                                }, {
                                    duration: 200,
                                    queue: !1,
                                    easing: "easeOutQuad",
                                    complete: function() {
                                        e.remove()
                                    }
                                })
                            }
                        })
                    } else
                        e.velocity({
                            translateX: 0
                        }, {
                            duration: 100,
                            queue: !1,
                            easing: "easeOutQuad"
                        });
                    b = !1,
                    c = !1
                }
            })
        })
    })
}(jQuery),
function(a) {
    Materialize.scrollFire = function(a) {
        var b = !1;
        window.addEventListener("scroll", function() {
            b = !0
        }),
        setInterval(function() {
            if (b) {
                b = !1;
                for (var c = window.pageYOffset + window.innerHeight, d = 0; d < a.length; d++) {
                    var e = a[d]
                      , f = e.selector
                      , g = e.offset
                      , h = e.callback
                      , i = document.querySelector(f);
                    if (null !== i) {
                        var j = i.getBoundingClientRect().top + window.pageYOffset;
                        if (c > j + g && e.done !== !0) {
                            var k = new Function(h);
                            k(),
                            e.done = !0
                        }
                    }
                }
            }
        }, 100)
    }
}(jQuery),
function(a) {
    "function" == typeof define && false ? define("picker", ["jquery"], a) : "object" == typeof exports ? module.exports = a(require("jquery")) : this.Picker = a(jQuery)
}(function(a) {
    function b(f, g, i, l) {
        function m() {
            return b._.node("div", b._.node("div", b._.node("div", b._.node("div", y.component.nodes(t.open), v.box), v.wrap), v.frame), v.holder)
        }
        function n() {
            w.data(g, y).addClass(v.input).attr("tabindex", -1).val(w.data("value") ? y.get("select", u.format) : f.value),
            u.editable || w.on("focus." + t.id + " click." + t.id, function(a) {
                a.preventDefault(),
                y.$root[0].focus()
            }).on("keydown." + t.id, q),
            e(f, {
                haspopup: !0,
                expanded: !1,
                readonly: !1,
                owns: f.id + "_root"
            })
        }
        function o() {
            y.$root.on({
                keydown: q,
                focusin: function(a) {
                    y.$root.removeClass(v.focused),
                    a.stopPropagation()
                },
                "mousedown click": function(b) {
                    var c = b.target;
                    c != y.$root.children()[0] && (b.stopPropagation(),
                    "mousedown" != b.type || a(c).is("input, select, textarea, button, option") || (b.preventDefault(),
                    y.$root[0].focus()))
                }
            }).on({
                focus: function() {
                    w.addClass(v.target)
                },
                blur: function() {
                    w.removeClass(v.target)
                }
            }).on("focus.toOpen", r).on("click", "[data-pick], [data-nav], [data-clear], [data-close]", function() {
                var b = a(this)
                  , c = b.data()
                  , d = b.hasClass(v.navDisabled) || b.hasClass(v.disabled)
                  , e = h();
                e = e && (e.type || e.href),
                (d || e && !a.contains(y.$root[0], e)) && y.$root[0].focus(),
                !d && c.nav ? y.set("highlight", y.component.item.highlight, {
                    nav: c.nav
                }) : !d && "pick"in c ? y.set("select", c.pick) : c.clear ? y.clear().close(!0) : c.close && y.close(!0)
            }),
            e(y.$root[0], "hidden", !0)
        }
        function p() {
            var b;
            u.hiddenName === !0 ? (b = f.name,
            f.name = "") : (b = ["string" == typeof u.hiddenPrefix ? u.hiddenPrefix : "", "string" == typeof u.hiddenSuffix ? u.hiddenSuffix : "_submit"],
            b = b[0] + f.name + b[1]),
            y._hidden = a('<input type=hidden name="' + b + '"' + (w.data("value") || f.value ? ' value="' + y.get("select", u.formatSubmit) + '"' : "") + ">")[0],
            w.on("change." + t.id, function() {
                y._hidden.value = f.value ? y.get("select", u.formatSubmit) : ""
            }),
            u.container ? a(u.container).append(y._hidden) : w.after(y._hidden)
        }
        function q(a) {
            var b = a.keyCode
              , c = /^(8|46)$/.test(b);
            return 27 == b ? (y.close(),
            !1) : void ((32 == b || c || !t.open && y.component.key[b]) && (a.preventDefault(),
            a.stopPropagation(),
            c ? y.clear().close() : y.open()))
        }
        function r(a) {
            a.stopPropagation(),
            "focus" == a.type && y.$root.addClass(v.focused),
            y.open()
        }
        if (!f)
            return b;
        var s = !1
          , t = {
            id: f.id || "P" + Math.abs(~~(Math.random() * new Date))
        }
          , u = i ? a.extend(!0, {}, i.defaults, l) : l || {}
          , v = a.extend({}, b.klasses(), u.klass)
          , w = a(f)
          , x = function() {
            return this.start()
        }
          , y = x.prototype = {
            constructor: x,
            $node: w,
            start: function() {
                return t && t.start ? y : (t.methods = {},
                t.start = !0,
                t.open = !1,
                t.type = f.type,
                f.autofocus = f == h(),
                f.readOnly = !u.editable,
                f.id = f.id || t.id,
                "text" != f.type && (f.type = "text"),
                y.component = new i(y,u),
                y.$root = a(b._.node("div", m(), v.picker, 'id="' + f.id + '_root" tabindex="0"')),
                o(),
                u.formatSubmit && p(),
                n(),
                u.container ? a(u.container).append(y.$root) : w.after(y.$root),
                y.on({
                    start: y.component.onStart,
                    render: y.component.onRender,
                    stop: y.component.onStop,
                    open: y.component.onOpen,
                    close: y.component.onClose,
                    set: y.component.onSet
                }).on({
                    start: u.onStart,
                    render: u.onRender,
                    stop: u.onStop,
                    open: u.onOpen,
                    close: u.onClose,
                    set: u.onSet
                }),
                s = c(y.$root.children()[0]),
                f.autofocus && y.open(),
                y.trigger("start").trigger("render"))
            },
            render: function(a) {
                return a ? y.$root.html(m()) : y.$root.find("." + v.box).html(y.component.nodes(t.open)),
                y.trigger("render")
            },
            stop: function() {
                return t.start ? (y.close(),
                y._hidden && y._hidden.parentNode.removeChild(y._hidden),
                y.$root.remove(),
                w.removeClass(v.input).removeData(g),
                setTimeout(function() {
                    w.off("." + t.id)
                }, 0),
                f.type = t.type,
                f.readOnly = !1,
                y.trigger("stop"),
                t.methods = {},
                t.start = !1,
                y) : y
            },
            open: function(c) {
                return t.open ? y : (w.addClass(v.active),
                e(f, "expanded", !0),
                setTimeout(function() {
                    y.$root.addClass(v.opened),
                    e(y.$root[0], "hidden", !1)
                }, 0),
                c !== !1 && (t.open = !0,
                s && k.css("overflow", "hidden").css("padding-right", "+=" + d()),
                y.$root[0].focus(),
                j.on("click." + t.id + " focusin." + t.id, function(a) {
                    var b = a.target;
                    b != f && b != document && 3 != a.which && y.close(b === y.$root.children()[0])
                }).on("keydown." + t.id, function(c) {
                    var d = c.keyCode
                      , e = y.component.key[d]
                      , f = c.target;
                    27 == d ? y.close(!0) : f != y.$root[0] || !e && 13 != d ? a.contains(y.$root[0], f) && 13 == d && (c.preventDefault(),
                    f.click()) : (c.preventDefault(),
                    e ? b._.trigger(y.component.key.go, y, [b._.trigger(e)]) : y.$root.find("." + v.highlighted).hasClass(v.disabled) || y.set("select", y.component.item.highlight).close())
                })),
                y.trigger("open"))
            },
            close: function(a) {
                return a && (y.$root.off("focus.toOpen")[0].focus(),
                setTimeout(function() {
                    y.$root.on("focus.toOpen", r)
                }, 0)),
                w.removeClass(v.active),
                e(f, "expanded", !1),
                setTimeout(function() {
                    y.$root.removeClass(v.opened + " " + v.focused),
                    e(y.$root[0], "hidden", !0)
                }, 0),
                t.open ? (t.open = !1,
                s && k.css("overflow", "").css("padding-right", "-=" + d()),
                j.off("." + t.id),
                y.trigger("close")) : y
            },
            clear: function(a) {
                return y.set("clear", null, a)
            },
            set: function(b, c, d) {
                var e, f, g = a.isPlainObject(b), h = g ? b : {};
                if (d = g && a.isPlainObject(c) ? c : d || {},
                b) {
                    g || (h[b] = c);
                    for (e in h)
                        f = h[e],
                        e in y.component.item && (void 0 === f && (f = null),
                        y.component.set(e, f, d)),
                        ("select" == e || "clear" == e) && w.val("clear" == e ? "" : y.get(e, u.format)).trigger("change");
                    y.render()
                }
                return d.muted ? y : y.trigger("set", h)
            },
            get: function(a, c) {
                if (a = a || "value",
                null != t[a])
                    return t[a];
                if ("valueSubmit" == a) {
                    if (y._hidden)
                        return y._hidden.value;
                    a = "value"
                }
                if ("value" == a)
                    return f.value;
                if (a in y.component.item) {
                    if ("string" == typeof c) {
                        var d = y.component.get(a);
                        return d ? b._.trigger(y.component.formats.toString, y.component, [c, d]) : ""
                    }
                    return y.component.get(a)
                }
            },
            on: function(b, c, d) {
                var e, f, g = a.isPlainObject(b), h = g ? b : {};
                if (b) {
                    g || (h[b] = c);
                    for (e in h)
                        f = h[e],
                        d && (e = "_" + e),
                        t.methods[e] = t.methods[e] || [],
                        t.methods[e].push(f)
                }
                return y
            },
            off: function() {
                var a, b, c = arguments;
                for (a = 0,
                namesCount = c.length; a < namesCount; a += 1)
                    b = c[a],
                    b in t.methods && delete t.methods[b];
                return y
            },
            trigger: function(a, c) {
                var d = function(a) {
                    var d = t.methods[a];
                    d && d.map(function(a) {
                        b._.trigger(a, y, [c])
                    })
                };
                return d("_" + a),
                d(a),
                y
            }
        };
        return new x
    }
    function c(a) {
        var b, c = "position";
        return a.currentStyle ? b = a.currentStyle[c] : window.getComputedStyle && (b = getComputedStyle(a)[c]),
        "fixed" == b
    }
    function d() {
        if (k.height() <= i.height())
            return 0;
        var b = a('<div style="visibility:hidden;width:100px" />').appendTo("body")
          , c = b[0].offsetWidth;
        b.css("overflow", "scroll");
        var d = a('<div style="width:100%" />').appendTo(b)
          , e = d[0].offsetWidth;
        return b.remove(),
        c - e
    }
    function e(b, c, d) {
        if (a.isPlainObject(c))
            for (var e in c)
                f(b, e, c[e]);
        else
            f(b, c, d)
    }
    function f(a, b, c) {
        a.setAttribute(("role" == b ? "" : "aria-") + b, c)
    }
    function g(b, c) {
        a.isPlainObject(b) || (b = {
            attribute: c
        }),
        c = "";
        for (var d in b) {
            var e = ("role" == d ? "" : "aria-") + d
              , f = b[d];
            c += null == f ? "" : e + '="' + b[d] + '"'
        }
        return c
    }
    function h() {
        try {
            return document.activeElement
        } catch (a) {}
    }
    var i = a(window)
      , j = a(document)
      , k = a(document.documentElement);
    return b.klasses = function(a) {
        return a = a || "picker",
        {
            picker: a,
            opened: a + "--opened",
            focused: a + "--focused",
            input: a + "__input",
            active: a + "__input--active",
            target: a + "__input--target",
            holder: a + "__holder",
            frame: a + "__frame",
            wrap: a + "__wrap",
            box: a + "__box"
        }
    }
    ,
    b._ = {
        group: function(a) {
            for (var c, d = "", e = b._.trigger(a.min, a); e <= b._.trigger(a.max, a, [e]); e += a.i)
                c = b._.trigger(a.item, a, [e]),
                d += b._.node(a.node, c[0], c[1], c[2]);
            return d
        },
        node: function(b, c, d, e) {
            return c ? (c = a.isArray(c) ? c.join("") : c,
            d = d ? ' class="' + d + '"' : "",
            e = e ? " " + e : "",
            "<" + b + d + e + ">" + c + "</" + b + ">") : ""
        },
        lead: function(a) {
            return (10 > a ? "0" : "") + a
        },
        trigger: function(a, b, c) {
            return "function" == typeof a ? a.apply(b, c || []) : a
        },
        digits: function(a) {
            return /\d/.test(a[1]) ? 2 : 1
        },
        isDate: function(a) {
            return {}.toString.call(a).indexOf("Date") > -1 && this.isInteger(a.getDate())
        },
        isInteger: function(a) {
            return {}.toString.call(a).indexOf("Number") > -1 && a % 1 === 0
        },
        ariaAttr: g
    },
    b.extend = function(c, d) {
        a.fn[c] = function(e, f) {
            var g = this.data(c);
            return "picker" == e ? g : g && "string" == typeof e ? b._.trigger(g[e], g, [f]) : this.each(function() {
                var f = a(this);
                f.data(c) || new b(this,c,d,e)
            })
        }
        ,
        a.fn[c].defaults = d.defaults
    }
    ,
    b
}),
function(a) {
    "function" == typeof define && false ? define(["picker", "jquery"], a) : "object" == typeof exports ? module.exports = a(require("./picker.js"), require("jquery")) : a(Picker, jQuery)
}(function(a, b) {
    function c(a, b) {
        var c = this
          , d = a.$node[0]
          , e = d.value
          , f = a.$node.data("value")
          , g = f || e
          , h = f ? b.formatSubmit : b.format
          , i = function() {
            return d.currentStyle ? "rtl" == d.currentStyle.direction : "rtl" == getComputedStyle(a.$root[0]).direction
        };
        c.settings = b,
        c.$node = a.$node,
        c.queue = {
            min: "measure create",
            max: "measure create",
            now: "now create",
            select: "parse create validate",
            highlight: "parse navigate create validate",
            view: "parse create validate viewset",
            disable: "deactivate",
            enable: "activate"
        },
        c.item = {},
        c.item.clear = null,
        c.item.disable = (b.disable || []).slice(0),
        c.item.enable = -function(a) {
            return a[0] === !0 ? a.shift() : -1
        }(c.item.disable),
        c.set("min", b.min).set("max", b.max).set("now"),
        g ? c.set("select", g, {
            format: h
        }) : c.set("select", null).set("highlight", c.item.now),
        c.key = {
            40: 7,
            38: -7,
            39: function() {
                return i() ? -1 : 1
            },
            37: function() {
                return i() ? 1 : -1
            },
            go: function(a) {
                var b = c.item.highlight
                  , d = new Date(b.year,b.month,b.date + a);
                c.set("highlight", d, {
                    interval: a
                }),
                this.render()
            }
        },
        a.on("render", function() {
            a.$root.find("." + b.klass.selectMonth).on("change", function() {
                var c = this.value;
                c && (a.set("highlight", [a.get("view").year, c, a.get("highlight").date]),
                a.$root.find("." + b.klass.selectMonth).trigger("focus"))
            }),
            a.$root.find("." + b.klass.selectYear).on("change", function() {
                var c = this.value;
                c && (a.set("highlight", [c, a.get("view").month, a.get("highlight").date]),
                a.$root.find("." + b.klass.selectYear).trigger("focus"))
            })
        }, 1).on("open", function() {
            var d = "";
            c.disabled(c.get("now")) && (d = ":not(." + b.klass.buttonToday + ")"),
            a.$root.find("button" + d + ", select").attr("disabled", !1)
        }, 1).on("close", function() {
            a.$root.find("button, select").attr("disabled", !0)
        }, 1)
    }
    var d = 7
      , e = 6
      , f = a._;
    c.prototype.set = function(a, b, c) {
        var d = this
          , e = d.item;
        return null === b ? ("clear" == a && (a = "select"),
        e[a] = b,
        d) : (e["enable" == a ? "disable" : "flip" == a ? "enable" : a] = d.queue[a].split(" ").map(function(e) {
            return b = d[e](a, b, c)
        }).pop(),
        "select" == a ? d.set("highlight", e.select, c) : "highlight" == a ? d.set("view", e.highlight, c) : a.match(/^(flip|min|max|disable|enable)$/) && (e.select && d.disabled(e.select) && d.set("select", e.select, c),
        e.highlight && d.disabled(e.highlight) && d.set("highlight", e.highlight, c)),
        d)
    }
    ,
    c.prototype.get = function(a) {
        return this.item[a]
    }
    ,
    c.prototype.create = function(a, c, d) {
        var e, g = this;
        return c = void 0 === c ? a : c,
        c == -(1 / 0) || c == 1 / 0 ? e = c : b.isPlainObject(c) && f.isInteger(c.pick) ? c = c.obj : b.isArray(c) ? (c = new Date(c[0],c[1],c[2]),
        c = f.isDate(c) ? c : g.create().obj) : c = f.isInteger(c) || f.isDate(c) ? g.normalize(new Date(c), d) : g.now(a, c, d),
        {
            year: e || c.getFullYear(),
            month: e || c.getMonth(),
            date: e || c.getDate(),
            day: e || c.getDay(),
            obj: e || c,
            pick: e || c.getTime()
        }
    }
    ,
    c.prototype.createRange = function(a, c) {
        var d = this
          , e = function(a) {
            return a === !0 || b.isArray(a) || f.isDate(a) ? d.create(a) : a
        };
        return f.isInteger(a) || (a = e(a)),
        f.isInteger(c) || (c = e(c)),
        f.isInteger(a) && b.isPlainObject(c) ? a = [c.year, c.month, c.date + a] : f.isInteger(c) && b.isPlainObject(a) && (c = [a.year, a.month, a.date + c]),
        {
            from: e(a),
            to: e(c)
        }
    }
    ,
    c.prototype.withinRange = function(a, b) {
        return a = this.createRange(a.from, a.to),
        b.pick >= a.from.pick && b.pick <= a.to.pick
    }
    ,
    c.prototype.overlapRanges = function(a, b) {
        var c = this;
        return a = c.createRange(a.from, a.to),
        b = c.createRange(b.from, b.to),
        c.withinRange(a, b.from) || c.withinRange(a, b.to) || c.withinRange(b, a.from) || c.withinRange(b, a.to)
    }
    ,
    c.prototype.now = function(a, b, c) {
        return b = new Date,
        c && c.rel && b.setDate(b.getDate() + c.rel),
        this.normalize(b, c)
    }
    ,
    c.prototype.navigate = function(a, c, d) {
        var e, f, g, h, i = b.isArray(c), j = b.isPlainObject(c), k = this.item.view;
        if (i || j) {
            for (j ? (f = c.year,
            g = c.month,
            h = c.date) : (f = +c[0],
            g = +c[1],
            h = +c[2]),
            d && d.nav && k && k.month !== g && (f = k.year,
            g = k.month),
            e = new Date(f,g + (d && d.nav ? d.nav : 0),1),
            f = e.getFullYear(),
            g = e.getMonth(); new Date(f,g,h).getMonth() !== g; )
                h -= 1;
            c = [f, g, h]
        }
        return c
    }
    ,
    c.prototype.normalize = function(a) {
        return a.setHours(0, 0, 0, 0),
        a
    }
    ,
    c.prototype.measure = function(a, b) {
        var c = this;
        return b ? "string" == typeof b ? b = c.parse(a, b) : f.isInteger(b) && (b = c.now(a, b, {
            rel: b
        })) : b = "min" == a ? -(1 / 0) : 1 / 0,
        b
    }
    ,
    c.prototype.viewset = function(a, b) {
        return this.create([b.year, b.month, 1])
    }
    ,
    c.prototype.validate = function(a, c, d) {
        var e, g, h, i, j = this, k = c, l = d && d.interval ? d.interval : 1, m = -1 === j.item.enable, n = j.item.min, o = j.item.max, p = m && j.item.disable.filter(function(a) {
            if (b.isArray(a)) {
                var d = j.create(a).pick;
                d < c.pick ? e = !0 : d > c.pick && (g = !0)
            }
            return f.isInteger(a)
        }).length;
        if ((!d || !d.nav) && (!m && j.disabled(c) || m && j.disabled(c) && (p || e || g) || !m && (c.pick <= n.pick || c.pick >= o.pick)))
            for (m && !p && (!g && l > 0 || !e && 0 > l) && (l *= -1); j.disabled(c) && (Math.abs(l) > 1 && (c.month < k.month || c.month > k.month) && (c = k,
            l = l > 0 ? 1 : -1),
            c.pick <= n.pick ? (h = !0,
            l = 1,
            c = j.create([n.year, n.month, n.date + (c.pick === n.pick ? 0 : -1)])) : c.pick >= o.pick && (i = !0,
            l = -1,
            c = j.create([o.year, o.month, o.date + (c.pick === o.pick ? 0 : 1)])),
            !h || !i); )
                c = j.create([c.year, c.month, c.date + l]);
        return c
    }
    ,
    c.prototype.disabled = function(a) {
        var c = this
          , d = c.item.disable.filter(function(d) {
            return f.isInteger(d) ? a.day === (c.settings.firstDay ? d : d - 1) % 7 : b.isArray(d) || f.isDate(d) ? a.pick === c.create(d).pick : b.isPlainObject(d) ? c.withinRange(d, a) : void 0
        });
        return d = d.length && !d.filter(function(a) {
            return b.isArray(a) && "inverted" == a[3] || b.isPlainObject(a) && a.inverted
        }).length,
        -1 === c.item.enable ? !d : d || a.pick < c.item.min.pick || a.pick > c.item.max.pick
    }
    ,
    c.prototype.parse = function(a, b, c) {
        var d = this
          , e = {};
        return b && "string" == typeof b ? (c && c.format || (c = c || {},
        c.format = d.settings.format),
        d.formats.toArray(c.format).map(function(a) {
            var c = d.formats[a]
              , g = c ? f.trigger(c, d, [b, e]) : a.replace(/^!/, "").length;
            c && (e[a] = b.substr(0, g)),
            b = b.substr(g)
        }),
        [e.yyyy || e.yy, +(e.mm || e.m) - 1, e.dd || e.d]) : b
    }
    ,
    c.prototype.formats = function() {
        function a(a, b, c) {
            var d = a.match(/\w+/)[0];
            return c.mm || c.m || (c.m = b.indexOf(d) + 1),
            d.length
        }
        function b(a) {
            return a.match(/\w+/)[0].length
        }
        return {
            d: function(a, b) {
                return a ? f.digits(a) : b.date
            },
            dd: function(a, b) {
                return a ? 2 : f.lead(b.date)
            },
            ddd: function(a, c) {
                return a ? b(a) : this.settings.weekdaysShort[c.day]
            },
            dddd: function(a, c) {
                return a ? b(a) : this.settings.weekdaysFull[c.day]
            },
            m: function(a, b) {
                return a ? f.digits(a) : b.month + 1
            },
            mm: function(a, b) {
                return a ? 2 : f.lead(b.month + 1)
            },
            mmm: function(b, c) {
                var d = this.settings.monthsShort;
                return b ? a(b, d, c) : d[c.month]
            },
            mmmm: function(b, c) {
                var d = this.settings.monthsFull;
                return b ? a(b, d, c) : d[c.month]
            },
            yy: function(a, b) {
                return a ? 2 : ("" + b.year).slice(2)
            },
            yyyy: function(a, b) {
                return a ? 4 : b.year
            },
            toArray: function(a) {
                return a.split(/(d{1,4}|m{1,4}|y{4}|yy|!.)/g)
            },
            toString: function(a, b) {
                var c = this;
                return c.formats.toArray(a).map(function(a) {
                    return f.trigger(c.formats[a], c, [0, b]) || a.replace(/^!/, "")
                }).join("")
            }
        }
    }(),
    c.prototype.isDateExact = function(a, c) {
        var d = this;
        return f.isInteger(a) && f.isInteger(c) || "boolean" == typeof a && "boolean" == typeof c ? a === c : (f.isDate(a) || b.isArray(a)) && (f.isDate(c) || b.isArray(c)) ? d.create(a).pick === d.create(c).pick : b.isPlainObject(a) && b.isPlainObject(c) ? d.isDateExact(a.from, c.from) && d.isDateExact(a.to, c.to) : !1
    }
    ,
    c.prototype.isDateOverlap = function(a, c) {
        var d = this
          , e = d.settings.firstDay ? 1 : 0;
        return f.isInteger(a) && (f.isDate(c) || b.isArray(c)) ? (a = a % 7 + e,
        a === d.create(c).day + 1) : f.isInteger(c) && (f.isDate(a) || b.isArray(a)) ? (c = c % 7 + e,
        c === d.create(a).day + 1) : b.isPlainObject(a) && b.isPlainObject(c) ? d.overlapRanges(a, c) : !1
    }
    ,
    c.prototype.flipEnable = function(a) {
        var b = this.item;
        b.enable = a || (-1 == b.enable ? 1 : -1)
    }
    ,
    c.prototype.deactivate = function(a, c) {
        var d = this
          , e = d.item.disable.slice(0);
        return "flip" == c ? d.flipEnable() : c === !1 ? (d.flipEnable(1),
        e = []) : c === !0 ? (d.flipEnable(-1),
        e = []) : c.map(function(a) {
            for (var c, g = 0; g < e.length; g += 1)
                if (d.isDateExact(a, e[g])) {
                    c = !0;
                    break
                }
            c || (f.isInteger(a) || f.isDate(a) || b.isArray(a) || b.isPlainObject(a) && a.from && a.to) && e.push(a)
        }),
        e
    }
    ,
    c.prototype.activate = function(a, c) {
        var d = this
          , e = d.item.disable
          , g = e.length;
        return "flip" == c ? d.flipEnable() : c === !0 ? (d.flipEnable(1),
        e = []) : c === !1 ? (d.flipEnable(-1),
        e = []) : c.map(function(a) {
            var c, h, i, j;
            for (i = 0; g > i; i += 1) {
                if (h = e[i],
                d.isDateExact(h, a)) {
                    c = e[i] = null,
                    j = !0;
                    break
                }
                if (d.isDateOverlap(h, a)) {
                    b.isPlainObject(a) ? (a.inverted = !0,
                    c = a) : b.isArray(a) ? (c = a,
                    c[3] || c.push("inverted")) : f.isDate(a) && (c = [a.getFullYear(), a.getMonth(), a.getDate(), "inverted"]);
                    break
                }
            }
            if (c)
                for (i = 0; g > i; i += 1)
                    if (d.isDateExact(e[i], a)) {
                        e[i] = null;
                        break
                    }
            if (j)
                for (i = 0; g > i; i += 1)
                    if (d.isDateOverlap(e[i], a)) {
                        e[i] = null;
                        break
                    }
            c && e.push(c)
        }),
        e.filter(function(a) {
            return null != a
        })
    }
    ,
    c.prototype.nodes = function(a) {
        var b = this
          , c = b.settings
          , g = b.item
          , h = g.now
          , i = g.select
          , j = g.highlight
          , k = g.view
          , l = g.disable
          , m = g.min
          , n = g.max
          , o = function(a, b) {
            return c.firstDay && (a.push(a.shift()),
            b.push(b.shift())),
            f.node("thead", f.node("tr", f.group({
                min: 0,
                max: d - 1,
                i: 1,
                node: "th",
                item: function(d) {
                    return [a[d], c.klass.weekdays, 'scope=col title="' + b[d] + '"']
                }
            })))
        }((c.showWeekdaysFull ? c.weekdaysFull : c.weekdaysLetter).slice(0), c.weekdaysFull.slice(0))
          , p = function(a) {
            return f.node("div", " ", c.klass["nav" + (a ? "Next" : "Prev")] + (a && k.year >= n.year && k.month >= n.month || !a && k.year <= m.year && k.month <= m.month ? " " + c.klass.navDisabled : ""), "data-nav=" + (a || -1) + " " + f.ariaAttr({
                role: "button",
                controls: b.$node[0].id + "_table"
            }) + ' title="' + (a ? c.labelMonthNext : c.labelMonthPrev) + '"')
        }
          , q = function(d) {
            var e = c.showMonthsShort ? c.monthsShort : c.monthsFull;
            return "short_months" == d && (e = c.monthsShort),
            c.selectMonths && void 0 == d ? f.node("select", f.group({
                min: 0,
                max: 11,
                i: 1,
                node: "option",
                item: function(a) {
                    return [e[a], 0, "value=" + a + (k.month == a ? " selected" : "") + (k.year == m.year && a < m.month || k.year == n.year && a > n.month ? " disabled" : "")]
                }
            }), c.klass.selectMonth + " browser-default", (a ? "" : "disabled") + " " + f.ariaAttr({
                controls: b.$node[0].id + "_table"
            }) + ' title="' + c.labelMonthSelect + '"') : "short_months" == d ? null != i ? f.node("div", e[i.month]) : f.node("div", e[k.month]) : f.node("div", e[k.month], c.klass.month)
        }
          , r = function(d) {
            var e = k.year
              , g = c.selectYears === !0 ? 5 : ~~(c.selectYears / 2);
            if (g) {
                var h = m.year
                  , i = n.year
                  , j = e - g
                  , l = e + g;
                if (h > j && (l += h - j,
                j = h),
                l > i) {
                    var o = j - h
                      , p = l - i;
                    j -= o > p ? p : o,
                    l = i
                }
                if (c.selectYears && void 0 == d)
                    return f.node("select", f.group({
                        min: j,
                        max: l,
                        i: 1,
                        node: "option",
                        item: function(a) {
                            return [a, 0, "value=" + a + (e == a ? " selected" : "")]
                        }
                    }), c.klass.selectYear + " browser-default", (a ? "" : "disabled") + " " + f.ariaAttr({
                        controls: b.$node[0].id + "_table"
                    }) + ' title="' + c.labelYearSelect + '"')
            }
            return "raw" == d ? f.node("div", e) : f.node("div", e, c.klass.year)
        };
        return createDayLabel = function() {
            return null != i ? f.node("div", i.date) : f.node("div", h.date)
        }
        ,
        createWeekdayLabel = function() {
            var a;
            a = null != i ? i.day : h.day;
            var b = c.weekdaysFull[a];
            return b
        }
        ,
        f.node("div", f.node("div", createWeekdayLabel(), "picker__weekday-display") + f.node("div", q("short_months"), c.klass.month_display) + f.node("div", createDayLabel(), c.klass.day_display) + f.node("div", r("raw"), c.klass.year_display), c.klass.date_display) + f.node("div", f.node("div", (c.selectYears ? q() + r() : q() + r()) + p() + p(1), c.klass.header) + f.node("table", o + f.node("tbody", f.group({
            min: 0,
            max: e - 1,
            i: 1,
            node: "tr",
            item: function(a) {
                var e = c.firstDay && 0 === b.create([k.year, k.month, 1]).day ? -7 : 0;
                return [f.group({
                    min: d * a - k.day + e + 1,
                    max: function() {
                        return this.min + d - 1
                    },
                    i: 1,
                    node: "td",
                    item: function(a) {
                        a = b.create([k.year, k.month, a + (c.firstDay ? 1 : 0)]);
                        var d = i && i.pick == a.pick
                          , e = j && j.pick == a.pick
                          , g = l && b.disabled(a) || a.pick < m.pick || a.pick > n.pick
                          , o = f.trigger(b.formats.toString, b, [c.format, a]);
                        return [f.node("div", a.date, function(b) {
                            return b.push(k.month == a.month ? c.klass.infocus : c.klass.outfocus),
                            h.pick == a.pick && b.push(c.klass.now),
                            d && b.push(c.klass.selected),
                            e && b.push(c.klass.highlighted),
                            g && b.push(c.klass.disabled),
                            b.join(" ")
                        }([c.klass.day]), "data-pick=" + a.pick + " " + f.ariaAttr({
                            role: "gridcell",
                            label: o,
                            selected: d && b.$node.val() === o ? !0 : null,
                            activedescendant: e ? !0 : null,
                            disabled: g ? !0 : null
                        })), "", f.ariaAttr({
                            role: "presentation"
                        })]
                    }
                })]
            }
        })), c.klass.table, 'id="' + b.$node[0].id + '_table" ' + f.ariaAttr({
            role: "grid",
            controls: b.$node[0].id,
            readonly: !0
        })), c.klass.calendar_container) + f.node("div", f.node("button", c.today, "btn-flat picker__today", "type=button data-pick=" + h.pick + (a && !b.disabled(h) ? "" : " disabled") + " " + f.ariaAttr({
            controls: b.$node[0].id
        })) + f.node("button", c.clear, "btn-flat picker__clear", "type=button data-clear=1" + (a ? "" : " disabled") + " " + f.ariaAttr({
            controls: b.$node[0].id
        })) + f.node("button", c.close, "btn-flat picker__close", "type=button data-close=true " + (a ? "" : " disabled") + " " + f.ariaAttr({
            controls: b.$node[0].id
        })), c.klass.footer)
    }
    ,
    c.defaults = function(a) {
        return {
            labelMonthNext: "Next month",
            labelMonthPrev: "Previous month",
            labelMonthSelect: "Select a month",
            labelYearSelect: "Select a year",
            monthsFull: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            weekdaysFull: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            weekdaysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            weekdaysLetter: ["S", "M", "T", "W", "T", "F", "S"],
            today: "Today",
            clear: "Clear",
            close: "Close",
            format: "d mmmm, yyyy",
            klass: {
                table: a + "table",
                header: a + "header",
                date_display: a + "date-display",
                day_display: a + "day-display",
                month_display: a + "month-display",
                year_display: a + "year-display",
                calendar_container: a + "calendar-container",
                navPrev: a + "nav--prev",
                navNext: a + "nav--next",
                navDisabled: a + "nav--disabled",
                month: a + "month",
                year: a + "year",
                selectMonth: a + "select--month",
                selectYear: a + "select--year",
                weekdays: a + "weekday",
                day: a + "day",
                disabled: a + "day--disabled",
                selected: a + "day--selected",
                highlighted: a + "day--highlighted",
                now: a + "day--today",
                infocus: a + "day--infocus",
                outfocus: a + "day--outfocus",
                footer: a + "footer",
                buttonClear: a + "button--clear",
                buttonToday: a + "button--today",
                buttonClose: a + "button--close"
            }
        }
    }(a.klasses().picker + "__"),
    a.extend("pickadate", c)
}),
function(a) {
    function b() {
        var b = +a(this).attr("length")
          , c = +a(this).val().length
          , d = b >= c;
        a(this).parent().find('span[class="character-counter"]').html(c + "/" + b),
        e(d, a(this))
    }
    function c(b) {
        var c = a("<span/>").addClass("character-counter").css("float", "right").css("font-size", "12px").css("height", 1);
        b.parent().append(c)
    }
    function d() {
        a(this).parent().find('span[class="character-counter"]').html("")
    }
    function e(a, b) {
        var c = b.hasClass("invalid");
        a && c ? b.removeClass("invalid") : a || c || (b.removeClass("valid"),
        b.addClass("invalid"))
    }
    a.fn.characterCounter = function() {
        return this.each(function() {
            var e = void 0 !== a(this).attr("length");
            e && (a(this).on("input", b),
            a(this).on("focus", b),
            a(this).on("blur", d),
            c(a(this)))
        })
    }
    ,
    a(document).ready(function() {
        a("input, textarea").characterCounter()
    })
}(jQuery),
function(a) {
    var b = {
        init: function(b) {
            var c = {
                time_constant: 200,
                dist: -100,
                shift: 0,
                padding: 0,
                full_width: !1
            };
            return b = a.extend(c, b),
            this.each(function() {
                function c() {
                    "undefined" != typeof window.ontouchstart && (F[0].addEventListener("touchstart", k),
                    F[0].addEventListener("touchmove", l),
                    F[0].addEventListener("touchend", m)),
                    F[0].addEventListener("mousedown", k),
                    F[0].addEventListener("mousemove", l),
                    F[0].addEventListener("mouseup", m),
                    F[0].addEventListener("click", j)
                }
                function d(a) {
                    return a.targetTouches && a.targetTouches.length >= 1 ? a.targetTouches[0].clientX : a.clientX
                }
                function e(a) {
                    return a.targetTouches && a.targetTouches.length >= 1 ? a.targetTouches[0].clientY : a.clientY
                }
                function f(a) {
                    return a >= s ? a % s : 0 > a ? f(s + a % s) : a
                }
                function g(a) {
                    var c, d, e, g, h, i, j;
                    for (o = "number" == typeof a ? a : o,
                    p = Math.floor((o + r / 2) / r),
                    e = o - p * r,
                    g = 0 > e ? 1 : -1,
                    h = -g * e * 2 / r,
                    b.full_width ? j = "translateX(0)" : (j = "translateX(" + (F[0].clientWidth - item_width) / 2 + "px) ",
                    j += "translateY(" + (F[0].clientHeight - item_width) / 2 + "px)"),
                    i = n[f(p)],
                    i.style[z] = j + " translateX(" + -e / 2 + "px) translateX(" + g * b.shift * h * c + "px) translateZ(" + b.dist * h + "px)",
                    i.style.zIndex = 0,
                    b.full_width ? tweenedOpacity = 1 : tweenedOpacity = 1 - .2 * h,
                    i.style.opacity = tweenedOpacity,
                    d = s >> 1,
                    c = 1; d >= c; ++c)
                        b.full_width ? (zTranslation = b.dist,
                        tweenedOpacity = c === d && 0 > e ? 1 - h : 1) : (zTranslation = b.dist * (2 * c + h * g),
                        tweenedOpacity = 1 - .2 * (2 * c + h * g)),
                        i = n[f(p + c)],
                        i.style[z] = j + " translateX(" + (b.shift + (r * c - e) / 2) + "px) translateZ(" + zTranslation + "px)",
                        i.style.zIndex = -c,
                        i.style.opacity = tweenedOpacity,
                        b.full_width ? (zTranslation = b.dist,
                        tweenedOpacity = c === d && e > 0 ? 1 - h : 1) : (zTranslation = b.dist * (2 * c - h * g),
                        tweenedOpacity = 1 - .2 * (2 * c - h * g)),
                        i = n[f(p - c)],
                        i.style[z] = j + " translateX(" + (-b.shift + (-r * c - e) / 2) + "px) translateZ(" + zTranslation + "px)",
                        i.style.zIndex = -c,
                        i.style.opacity = tweenedOpacity;
                    i = n[f(p)],
                    i.style[z] = j + " translateX(" + -e / 2 + "px) translateX(" + g * b.shift * h + "px) translateZ(" + b.dist * h + "px)",
                    i.style.zIndex = 0,
                    b.full_width ? tweenedOpacity = 1 : tweenedOpacity = 1 - .2 * h,
                    i.style.opacity = tweenedOpacity
                }
                function h() {
                    var a, b, c, d;
                    a = Date.now(),
                    b = a - B,
                    B = a,
                    c = o - A,
                    A = o,
                    d = 1e3 * c / (1 + b),
                    x = .8 * d + .2 * x
                }
                function i() {
                    var a, c;
                    v && (a = Date.now() - B,
                    c = v * Math.exp(-a / b.time_constant),
                    c > 2 || -2 > c ? (g(w - c),
                    requestAnimationFrame(i)) : g(w))
                }
                function j(c) {
                    if (D)
                        return c.preventDefault(),
                        c.stopPropagation(),
                        !1;
                    if (!b.full_width) {
                        var d = a(c.target).closest(".carousel-item").index()
                          , e = p % s - d;
                        0 > e ? Math.abs(e + s) < Math.abs(e) && (e += s) : e > 0 && Math.abs(e - s) < e && (e -= s),
                        0 > e ? a(this).trigger("carouselNext", [Math.abs(e)]) : e > 0 && a(this).trigger("carouselPrev", [e])
                    }
                }
                function k(a) {
                    q = !0,
                    D = !1,
                    E = !1,
                    t = d(a),
                    u = e(a),
                    x = v = 0,
                    A = o,
                    B = Date.now(),
                    clearInterval(C),
                    C = setInterval(h, 100)
                }
                function l(a) {
                    var b, c, f;
                    if (q)
                        if (b = d(a),
                        y = e(a),
                        c = t - b,
                        f = Math.abs(u - y),
                        30 > f && !E)
                            (c > 2 || -2 > c) && (D = !0,
                            t = b,
                            g(o + c));
                        else {
                            if (D)
                                return a.preventDefault(),
                                a.stopPropagation(),
                                !1;
                            E = !0
                        }
                    return D ? (a.preventDefault(),
                    a.stopPropagation(),
                    !1) : void 0
                }
                function m(a) {
                    return q = !1,
                    clearInterval(C),
                    w = o,
                    (x > 10 || -10 > x) && (v = .9 * x,
                    w = o + v),
                    w = Math.round(w / r) * r,
                    v = w - o,
                    B = Date.now(),
                    requestAnimationFrame(i),
                    a.preventDefault(),
                    a.stopPropagation(),
                    !1
                }
                var n, o, p, q, r, s, t, u, v, w, x, z, A, B, C, D, E, F = a(this);
                return F.hasClass("initialized") ? !0 : (b.full_width && (b.dist = 0,
                imageHeight = F.find(".carousel-item img").first().load(function() {
                    F.css("height", a(this).height())
                })),
                F.addClass("initialized"),
                q = !1,
                o = w = 0,
                n = [],
                item_width = F.find(".carousel-item").first().innerWidth(),
                r = 2 * item_width + b.padding,
                F.find(".carousel-item").each(function() {
                    n.push(a(this)[0])
                }),
                s = n.length,
                z = "transform",
                ["webkit", "Moz", "O", "ms"].every(function(a) {
                    var b = a + "Transform";
                    return "undefined" != typeof document.body.style[b] ? (z = b,
                    !1) : !0
                }),
                window.onresize = g,
                c(),
                g(o),
                a(this).on("carouselNext", function(a, b) {
                    void 0 === b && (b = 1),
                    w = o + r * b,
                    o !== w && (v = w - o,
                    B = Date.now(),
                    requestAnimationFrame(i))
                }),
                void a(this).on("carouselPrev", function(a, b) {
                    void 0 === b && (b = 1),
                    w = o - r * b,
                    o !== w && (v = w - o,
                    B = Date.now(),
                    requestAnimationFrame(i))
                }))
            })
        },
        next: function(b) {
            a(this).trigger("carouselNext", [b])
        },
        prev: function(b) {
            a(this).trigger("carouselPrev", [b])
        }
    };
    a.fn.carousel = function(c) {
        return b[c] ? b[c].apply(this, Array.prototype.slice.call(arguments, 1)) : "object" != typeof c && c ? void a.error("Method " + c + " does not exist on jQuery.carousel") : b.init.apply(this, arguments)
    }
}(jQuery);
;!function(r) {
    var n = {};
    function o(e) {
        if (n[e])
            return n[e].exports;
        var t = n[e] = {
            i: e,
            l: !1,
            exports: {}
        };
        return r[e].call(t.exports, t, t.exports, o),
        t.l = !0,
        t.exports
    }
    o.m = r,
    o.c = n,
    o.d = function(e, t, r) {
        o.o(e, t) || Object.defineProperty(e, t, {
            enumerable: !0,
            get: r
        })
    }
    ,
    o.r = function(e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }),
        Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }
    ,
    o.t = function(t, e) {
        if (1 & e && (t = o(t)),
        8 & e)
            return t;
        if (4 & e && "object" == typeof t && t && t.__esModule)
            return t;
        var r = Object.create(null);
        if (o.r(r),
        Object.defineProperty(r, "default", {
            enumerable: !0,
            value: t
        }),
        2 & e && "string" != typeof t)
            for (var n in t)
                o.d(r, n, function(e) {
                    return t[e]
                }
                .bind(null, n));
        return r
    }
    ,
    o.n = function(e) {
        var t = e && e.__esModule ? function() {
            return e.default
        }
        : function() {
            return e
        }
        ;
        return o.d(t, "a", t),
        t
    }
    ,
    o.o = function(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }
    ,
    o.p = "",
    o(o.s = 210)
}({
    210: function(e, t, r) {
        var n;
        n = zomato,
        "undefined" != typeof $ && (n._loadedScripts++,
        $(document).trigger("zready").off("zready"),
        void 0 !== n._totalScripts && n._totalScripts == n._loadedScripts && $(document).trigger("zreadyPageScripts"))
    }
});
