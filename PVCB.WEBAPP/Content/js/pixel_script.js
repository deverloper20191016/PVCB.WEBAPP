var latest_news_slick_setting = {
    dots: true,
    infinite: false,
    arrows: false,
    speed: 300,
    slidesToShow: 2,
    slidesToScroll: 1,
    outerEdgeLimit: true,
    customPaging: function (slider, i) {
        return '<div class="mx-1" style="width: 8px; cursor: pointer; height: 8px;" ></div>';
    },
    responsive: [
        {
            breakpoint: 4000,
            settings: 'unslick',
            //     // slidesToShow: 2,
            //     // slidesToScroll: 1,
        },
        {
            breakpoint: 992,
            settings: {
                slidesToShow: 2,
                // variableWidth: true,
                slidesToScroll: 1,
                infinite: false,
            }
        },
        {
            breakpoint: 768,
            settings: {
                slidesToShow: 2,
                variableWidth: true,
                slidesToScroll: 1,
                infinite: false,
            }
        },
        {
            breakpoint: 576,
            settings: {
                slidesToShow: 1,
                variableWidth: true,
                slidesToScroll: 1,
                infinite: false,
            }
        }
    ]
};

function nextSlideBanner() {
    $('#onboardBannerModal .sliders').slick('slickNext');
}
function lastSlideBanner() {
    $('#onboardBannerModal .sliders').slick('slickGoTo', 4);
}
var hideModal = false;
$(window).bind("load", function() {
    //insert all your ajax callback code here.
    //Which will run only after page is fully loaded in background.
    var windowsize = $(window).width();
    $(window).resize(function () {
        windowsize = $(window).width();
        if (windowsize > 992 && !hideModal) {
            $('#onboardBannerModal').modal('show');
        }
    });
});
windowsize = $(window).width();
if (windowsize > 992 && !hideModal) {
    $('#onboardBannerModal').modal('show');
}
$('#onboardBannerModal').on('shown.bs.modal', function (e) {
    // do something...
    document.getElementById('video0').play();
    $('#onboardBannerModal .sliders').on(
        'beforeChange', function(event, slick, current_slide_index, next_slide_index) {
            document.getElementById('video' + current_slide_index).pause();
            document.getElementById('video' + next_slide_index).play();
        }).on(
        'init', function(slick) {
            document.getElementById('onboarding-banner-dot-0').click();
        }).slick({
        infinite: false,
        dots: true,
        autoplay: false,
        swipe: false,
        prevArrow: $('#onboardBannerModal .prev'),
        nextArrow: $('#onboardBannerModal .next'),
        customPaging: function (slider, i) {
            return '<div class="mx-1" id="onboarding-banner-dot-'+i+'" style="width: 8px; cursor: pointer; height: 8px;" ></div>';
        },
    });
}).on('hidden.bs.modal', function (e) {
    // do something...
})
$(function () {
    var windowsize = $(window).width();
    $(window).resize(function () {
        windowsize = $(window).width();
        if (windowsize < 992) {
            $('.latest-news .slider').each(function (index, element) {
                if ($(element).hasClass('slick-initialized')) return;
                $(element).slick(latest_news_slick_setting);
            })
        }
        // else {
        //     $('.latest-news .slider').each(function(index, element) {
        //         if($(element).hasClass('slick-initialized')) $(element).slick('unslick');
        //     });
        // }
        // $('.main-slider').slick('resize');
    });

    var Accordion = function (el, multiple) {
        this.el = el || {};
        this.multiple = multiple || false;

        var links = this.el.find('.link');

        links.on('click', {el: this.el, multiple: this.multiple}, this.dropdown)
    }

    Accordion.prototype.dropdown = function (e) {
        if (windowsize < 992) {
            var $el = e.data.el;
            var $this = $(this),
                $next = $this.next();
            $next.slideToggle();
            $this.parent().toggleClass('open');
            $this.find('i').toggleClass('icon-plus--wh');
            $this.find('i').toggleClass('icon-minus--wh');

        }
    }
    var footerAccordion = new Accordion($('#footer-accordion'), false);
    var demo = new Accordion($('#demo'), false);

    $('.latest-news .slider').slick(latest_news_slick_setting);

    $('#main-banner.banner-slick').slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: true,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 4000,
        customPaging: function (slider, i) {
            var thumb = $(slider.$slides[i]).find('.banner-item').data('thumb');
            return '<div class="my-2" style="width: 60px; cursor: pointer; height: 31px; background-image: url(' + thumb + '); background-size: cover; background-repeat: no-repeat; background-position: right" ></div>';
        },
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    arrows: false,
                    customPaging: function (slider, i) {
                        return '<div class="mx-1" style="width: 8px; cursor: pointer; height: 8px;"></div>';
                    },
                }
            },
        ]
    });

    $(".bussiness-personal-tabs .button-stack button").click(function () {
        var data_tabs = $(this).data('tabs');
        // $(".bussiness-personal-tabs .button-stack button").removeClass('active');
        // $(this).addClass('active');
        $(data_tabs).parent().find('.tabs-container').removeClass('active');
        $(data_tabs).addClass('active')
    });

    //start custom slick slider for section_sub_category
    // Add opacity to temporary hide section sub-category
    $('#slick-sub-category-link').parents('section').attr('opacity', 0);
    $('#slick-sub-category-link').slick({
        infinite: false,
        slidesToShow: 8,
        slidesToScroll: 1,
        // variableWidth: false,
        prevArrow: '#prev',
        nextArrow: '#next',
        outerEdgeLimit: true,
        draggable: true,
        respondTo: 'slider',
        responsive: [
            {
                breakpoint: calcCategorySlick(8, 118.75),
                settings: {
                    slidesToShow: 7,
                    slidesToScroll: 1,
                    variableWidth: false,
                }
            },
            {
                breakpoint: calcCategorySlick(7, 118.75),
                settings: {
                    slidesToShow: 6,
                    slidesToScroll: 1,
                    variableWidth: false,
                }
            },
            {
                breakpoint: calcCategorySlick(6, 118.75),
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 1,
                    variableWidth: false,
                }
            },
            {
                breakpoint: calcCategorySlick(5, 118.75),
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    variableWidth: false,
                }
            },
            // {
            //     breakpoint: 712,
            //     settings: {
            //         slidesToShow: 5,
            //         slidesToScroll: 1,
            //         // variableWidth: false,
            //     }
            // },
            // {
            //     breakpoint: 593,
            //     settings: {
            //         slidesToShow: 4,
            //         slidesToScroll: 1,
            //         // variableWidth: false,
            //     }
            // },
            {
                breakpoint: 475,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    variableWidth: true,
                }
            }
        ]
    });
    // Remove opacity to show section sub-category
    $('#slick-sub-category-link').parents('section').removeAttr('opacity');
    //end custom slick slider for section_sub_category

    $('.button-back-to-top').on('click', function () {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    });
    $(window).on('scroll', function () {
        if (document.body.scrollTop >= 1800 || document.documentElement.scrollTop >= 1800) {
            $('.button-back-to-top').removeClass('hide');
        } else {
            $('.button-back-to-top').addClass('hide');
        }
    });
    if (window.innerWidth < 992) {
        $('.card-sticky-block .card-hover').addClass("box-shadow--lg");
    } else {
        $('.card-sticky-block .card-hover').removeClass("box-shadow--lg");
    }
    $(window).on('resize', function () {
        if (window.innerWidth < 992) {
            $('.card-sticky-block .card-hover').addClass("box-shadow--lg");
        } else {
            $('.card-sticky-block .card-hover').removeClass("box-shadow--lg");
        }
    });
    $('.card-sticky-block .card-hover').hover(
        function () {
            if (window.innerWidth > 992) {
                $(this).addClass("box-shadow--lg").addClass("on-hover");
            }
        }, function () {
            if (window.innerWidth > 992) {
                $(this).removeClass("box-shadow--lg").removeClass("on-hover");
            }
        }
    );

    // Remove all CKEditor custom attribute in promotion table (san pham O to)
    document.querySelectorAll('.promotion_detail_content table').forEach(function (ele) {
        Array.from(ele.attributes).forEach(function (attr) {
            ele.removeAttribute(attr.name)
        });
    });
    // Add class table table-striped for promotion table
    $('.promotion_detail_content table').addClass('table table-striped');

});

/** @param {HTMLElement} target */
function openNavMobile(target) {
    $('body').addClass('no-scroll');
    const navId = target.getAttribute('data-toggle');
    const navMobileContainer = document.getElementById(navId);
    navMobileContainer.classList.add('d-flex');
    navMobileContainer.classList.remove('d-none');
    setTimeout(function () {
        navMobileContainer.classList.remove('collapsed');
    }, 100);
}

/** @param {HTMLElement} target */
function closeNavMobile(target) {
    const navId = target.getAttribute('data-toggle');
    const navMobileContainer = document.getElementById(navId);
    navMobileContainer.classList.add('collapsed');
    $('body').removeClass('no-scroll');
    setTimeout(function () {
        navMobileContainer.classList.add('d-none');
        navMobileContainer.classList.remove('d-flex');
    }, 350);
}

// getParameter in URL
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function calcCategorySlick(numberSlideToShow, slideMinWidth) {
    var result = numberSlideToShow * slideMinWidth;
    return Math.ceil(result);
}


