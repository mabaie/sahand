import React from "react";
import Slider from "react-slick";
import "./styles.css";
import slide0 from "./images/pic11.jpg";
import slide1 from "./images/pic22.jpg";
import slide2 from "./images/pic33.jpg";
import bazar from "./images/bazar.png";
import sibapp from "./images/sibApp.png";
import bag from "./images/bag.png";
import awards from "./images/awards1.png";
import tree from "./images/tree-of-black-foliage.jpg";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Card from '@material-ui/core/Card';
import CardContent from "@material-ui/core/Card";

class SimpleSlider extends React.Component {
  render() {
    var settings = {
      dots: true,
      infinite: true,
      speed: 500,
      fade: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      lazyLoad: false,
      arrows: false,
      rtl: true
    };
    return (
      <Slider {...settings}>
        <div className="container" style={{ height: "100px", width: "100%" }}>
          <img
            src={slide0}
            alt="slide0"
            style={{ padding: "20px", height: "100%", width: "100%" }}
          />
          <div className="centered" style={{ fontSize: 40 }}>
            گزارش فعالیت های کلاسی به والدین
          </div>
        </div>
        <div className="container" style={{ height: "100px", width: "100%" }}>
          <img
            src={slide1}
            alt="slide1"
            style={{ padding: "20px", height: "100%", width: "100%" }}
          />
          <div className="centered" style={{ fontSize: 40 }}>
            نظارت مستمر والدین بر دانش‌آموز
          </div>
        </div>
        <div className="container" style={{ height: "100px", width: "100%" }}>
          <img
            src={slide2}
            alt="slide2"
            style={{ padding: "20px", height: "100%", width: "100%" }}
          />
          <div className="centered" style={{ fontSize: 40 }}>
            اطلاع از فعالیت‌های فوق برنامه
          </div>
        </div>
      </Slider>
    );
  }
}

class SecondBar extends React.Component {
  render() {
    return (
      <div style={{ backgroundColor: "#f0f0f0", padding: "20px" }}>
        <h1 style={{ color: "black", fontSize: 30, padding: 20 }}>
          مزایای سامانه هوشمند نظارت دانش‌آموز(سهند)
        </h1>
        <Grid
          container
          direction="row"
          alignItems="stretch"
          justify="center"
          spacing={16}
        >
          <Grid
            item
            xs={4}
		style={{backgroundColor:"blue"}}
          >
            <Card raised>
              <CardContent>
              <Grid container direction="column" spacing={12} alignItems='stretch' justify='space-between'
		style={{backgroundColor:"orange"}}>
              <Grid 
		item xs={4} ms={6}
		fullWidth
		style={{backgroundColor:'red'}}
		>
              <img
                src={awards}
                alt="slide2"
                style={{ padding: "30%", height: "100%", width: "100%" }}
              />
              </Grid>
              <Grid item xs={8} ms={6}
		fullWidth
		style={{backgroundColor:"green"}}
		> 
              <h2 style={{ margin: "5%", color: "black", fontSize: 25 }}>بررسی هوشمند تشویق‌های کلاسی</h2>
              <p style={{ margin: "5%", color: "black", fontSize: 20 }}>
                تشویق‌های کلاسی علاوه بر بیان میزان قوت دانش‌آموز در دروس، نشان‌دهنده علایق و ویژگی‌های شخصیتی کودک در اجتماع است. تحلیل هوشمند آن می‌تواند به آموزگاران، مشاوران تحصیلی و والدین کمک بسزایی خواهد کرد
              </p>
              </Grid>
              </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid
            item
            xs={4}
          >
            <Card raised style={{height: '100%'}}>
              <CardContent style={{height: '100%'}}>
              <Grid container direction="column" spacing={16} alignItems='stretch' justify='space-between'>
              <Grid item xs={4}>
              <img
                src={tree}
                alt="slide2"
                style={{ padding: "20px", height: "100%", width: "100%" }}
              />
              </Grid>
              <Grid item xs={8}>
              <h2 style={{ margin: "10px", color: "black", fontSize: 25 }}>
                {" "}
                کاهش استفاده از کاغذ
              </h2>
              <p style={{ margin: "10px", color: "black", fontSize: 20 }}>
                استفاده از سهند بخش زیادی از ارتباطات کاغذی مدرسه و والدین را
                حذف خواهد کرد. از این رو این سامانه می‌تواند در حفظ محیط زیست و
                درختان کمک کند.
              </p>
              </Grid>
              </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid
            item
            xs={4}
          >
            <Card raised style={{height: '100%'}}>
              <CardContent style={{height: '100%'}}>
              <Grid container direction="column" spacing={16} alignItems='stretch' justify='space-between'>
              <Grid item xs={4}>
              <img
                src={bag}
                alt="slide2"
                style={{ padding: "20px", height: "100%", width: "100%" }}
              />
              </Grid>
              <Grid item xs={8}>
              <h2 style={{ margin: "10px", color: "black", fontSize: 25 }}>
                کاهش وزن کیف دانش‌آموز
              </h2>

              <p style={{ margin: "10px", color: "black", fontSize: 20 }}>
                سهند در کوتاه مدت بخشی از ارتباطات کاغذی را کم می‌کند. اما این
                گروه قصد دارد در بلند مدت بخش سامانه آموزشی را به آن اضافه کند
                که موجب حذف تمرین‌های کاغذی و سبک شدن کیف دانش‌آموز می‌شود.
              </p>
              </Grid>
              </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    );
  }
}

class ThreeBar extends React.Component {
  render() {
    return (
      <div
        style={{
          paddingTop: 30,
          paddingBottom: 30,
          backgroundColor: "#019ccc"
        }}
      >
        <Grid
          container
          direction="row"
          alignItems="flex-start"
          alignContent="stretch"
          justify="center"
          spacing={16}
        >
          <Grid
            item
            xs={4}
            style={{ minWidth: "200px", maxWidth: "300px" }}
          >
            <Paper elevation={0} style={{ backgroundColor: "#019ccc" }}>
              <h2 style={{ margin: "10px", color: "white", fontSize: 20 }}>
                مشاهده برخط فعالیت‌های کلاسی
              </h2>
              <p style={{ margin: "10px", color: "white", fontSize: 20 }}>
                فعالیت‌های کلاسی توسط معلمین در قالب گزارش‌های کلاسی وارد می شود
                و به صورت برخط به والدین ارسال می‌شود.
              </p>
            </Paper>
          </Grid>
          <Grid
            item
            xs={4}
            style={{ minWidth: "200px", maxWidth: "300px" }}
          >
            <Paper elevation={0} style={{ backgroundColor: "#019ccc" }}>
              <h2 style={{ margin: "10px", color: "white", fontSize: 20 }}>
                مشاهده تکالیف روزانه
              </h2>
              <p style={{ margin: "10px", color: "white", fontSize: 20 }}>
                تمرین‌ها و تکالیف روزانه پس از بارگذاری توسط آموزگاران در دسترس
                والدین خواهد بود
              </p>
            </Paper>
          </Grid>
          <Grid
            item
            xs={4}
            style={{ minWidth: "200px", maxWidth: "300px" }}
          >
            <Paper elevation={0} style={{ backgroundColor: "#019ccc" }}>
              <h2 style={{ margin: "10px", color: "white", fontSize: 20 }}>
                مشاهده تقویم اجرایی
              </h2>
              <p style={{ margin: "10px", color: "white", fontSize: 20 }}>
                تقویم اجرایی شامل زمان برنامه‌های فوق برنامه‌ی مدرسه در سهند
                اطلاع‌رسانی می‌شود
              </p>
            </Paper>
          </Grid>
          <Grid
            item
            xs={4}
            style={{ minWidth: "200px", maxWidth: "300px" }}
          >
            <Paper elevation={0} style={{ backgroundColor: "#019ccc" }}>
              <h2 style={{ margin: "10px", color: "white", fontSize: 20 }}>
                اطلاع‌رسانی اخبار و فعالیت‌های مدرسه
              </h2>
              <p style={{ margin: "10px", color: "white", fontSize: 20 }}>
                اخبار مدرسه و فعالیت‌های انجام شده مدرسه در بخش اخبار مدرسه قابل
                مشاهده است
              </p>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

class FourBar extends React.Component {
  render() {
    return (
      <div
        style={{ paddingTop: 30, paddingBottom: 30, backgroundColor: "white" }}
      >
        <Grid
          container
          direction="row"
          alignItems="flex-start"
          alignContent="stretch"
          justify="center"
          spacing={16}
        >
          <Grid
            item
            xs={4}
            style={{ minWidth: "200px" }}
          >
            <Paper elevation={0}>
              <img
                src={require("./images/phone.jpg")}
                alt="slide2"
                style={{ height: "100%", width: "100%" }}
              />
            </Paper>
          </Grid>
          <Grid
            item
            xs={7}
            style={{ minWidth: "500px" }}
          >
            <Paper
              style={{
                justify: "flex-start"
              }}
              elevation={0}
            >
              <h2
                style={{
                  textAlign: "right",
                  margin: "10px",
                  color: "#019ccc",
                  fontSize: 25
                }}
              >
                میزان پیشرفت دانش‌آموز در دستان شما
              </h2>
              <p
                style={{
                  textAlign: "right",
                  margin: "10px",
                  color: "black",
                  fontSize: 20
                }}
              >
                سهند تلاشی برای تحلیل هوشمند و مستمر داده‌های تحصیلی، اخلاقی و
                استعدادهای عمومی کودکان با استفاده از جدیدترین الگوریتم‌های هوش
                مصنوعی است. داده‌های تحصیلی نه تنها امر خطیر شناسایی استعدادها و
                رغبت‌های تحصیلی را به صورتی دقیق نشان می‌دهد، بلکه تربیت فردی و
                اجتماعی کودکان را نیز با نظارتی جامع صورت خواهد داد. در بخش
                کارنما، گزارش‌ها و نمودارهای مختلف مربوط به پیشرفت تحصیلی
                دانش‌آموزان قابل مشاهده است. این بخش در کوتاه مدت شامل گزارشی از
                فعالیت‌ها، نمره‌ها، تشویق‌ها و حضور-غیاب دانش‌آموز است. پس از
                ورود داده‌های مختلف به اندازه کافی تحلیل‌های هوشمند در دسترس
                خواهد بود.
              </p>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

class FiveBar extends React.Component {
  render() {
    return (
      <div
        style={{
          paddingTop: 30,
          paddingBottom: 30,
          backgroundColor: "#f0f0f0"
        }}
      >
        <Grid
          container
          direction="row-reverse"
          alignItems="flex-start"
          alignContent="stretch"
          justify="center"
          spacing={16}
        >
          <Grid
            item
            xs={4}
            style={{ minWidth: "200px" }}
          >
            <Paper style={{ backgroundColor: "#f0f0f0" }} elevation={0}>
              <img
                src={require("./images/Parent.jpg")}
                alt="slide2"
                style={{ height: "100%", width: "100%" }}
              />
            </Paper>
          </Grid>
          <Grid
            item
            xs={7}
            style={{ minWidth: "500px" }}
          >
            <Paper
              style={{
                justify: "flex-start",
                backgroundColor: "#f0f0f0"
              }}
              elevation={0}
            >
              <h2
                style={{
                  textAlign: "right",
                  margin: "10px",
                  color: "#019ccc",
                  fontSize: 25
                }}
              >
                ارتباط آسان والدین، مدرسه و آموزگاران
              </h2>
              <p
                style={{
                  textAlign: "right",
                  margin: "10px",
                  color: "black",
                  fontSize: 20
                }}
              >
                ارتباط پیوسته معلم و والدین موجب پیشرف دانش‌آموزان بخصوص در سنین
                پایین خواهد بود. بخشی از ارتباطات برخط مانند ارسال مستقیم گزارش
                کلاسی، حضور-عیاب، تکالیف، تشویق‌ها و نمره‌ها به والدین از
                ویژگی‌های ذاتی سهند است. این برنامه همچنین امکان ارتباط نظارت
                شده معلمین و والدین از طریق ارسال پیام مستقیم را ارائه می‌کند.
                علاوه بر آن برای ارتباط رو در روی آموزگار و والدین، قابلیت
                زمانبندی ملاقات‌های حضوری را نیز فراهم می‌آورد.
              </p>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

class SixBar extends React.Component {
  render() {
    return (
      <div style={{ backgroundColor: "white" }}>
        <h1 style={{ color: "black", fontSize: 30, padding: 20 }}>
          دریافت اپلیکیشن
        </h1>
        <Grid
          container
          direction="row"
          alignItems="flex-start"
          justify="center"
          spacing={16}
        >
          <Grid
            item
            xs={4}
            style={{ minWidth: "250px", maxWidth: "350px" }}
          >
            <Paper style={{ marginLeft: 30, marginRight: 30 }} elevation={0}>
              <a href="https://cafebazaar.ir/app/com.sahand/">
                <img
                  src={bazar}
                  alt="slide2"
                  style={{ padding: "20px", height: "60%", width: "60%" }}
                />
                <h2 style={{ margin: "10px", color: "black", fontSize: 25 }}>
                  دریافت از کافه بازار
                </h2>
              </a>
            </Paper>
          </Grid>
          <Grid
            item
            xs={4}
            style={{ minWidth: "250px", maxWidth: "350px" }}
          >
            <Paper style={{ marginLeft: 30, marginRight: 30 }} elevation={0}>
              <img
                src={sibapp}
                alt="slide2"
                style={{ padding: "20px", height: "60%", width: "60%" }}
              />
              <h2 style={{ margin: "10px", color: "black", fontSize: 25 }}>
                دریافت از سیب اپ
              </h2>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

class Footer extends React.Component {
  render() {
    return (
      <div
        style={{
          paddingTop: 30,
          paddingBottom: 30,
          backgroundColor: "#555555"
        }}
      >
        <Grid
          container
          direction="row"
          alignItems="flex-start"
          alignContent="stretch"
          justify="center"
          spacing={16}
        >
          <Grid
            item
            xs={4}
            style={{ minWidth: "200px", maxWidth: "300px" }}
          >
            <Paper elevation={0} style={{ backgroundColor: "#555555" }}>
              <h2 style={{ margin: "10px", color: "white", fontSize: 20 }}>
                ایمیل پشتیبانی:
              </h2>
              <p style={{ margin: "10px", color: "white", fontSize: 20 }}>
                app.sahand@gmail.com
              </p>
            </Paper>
          </Grid>
          <Grid
            item
            xs={4}
            style={{ minWidth: "200px", maxWidth: "300px" }}
          >
            <Paper elevation={0} style={{ backgroundColor: "#555555" }}>
              <h2 style={{ margin: "10px", color: "white", fontSize: 20 }}>
                تلفن پشتیبانی:
              </h2>
              <p style={{ margin: "10px", color: "white", fontSize: 20 }}>
                09375981300
              </p>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

class LangingPage extends React.Component {
  render(){
  return (
    <div className="App">
      <div className="Slider">
        <SimpleSlider />
      </div>
      <div className="SecondBar">
        <SecondBar />
      </div>
      <div className="SecondBar">
        <ThreeBar />
      </div>
      <div className="SecondBar">
        <FourBar />
      </div>
      <div className="SecondBar">
        <FiveBar />
      </div>
      <div className="SecondBar">
        <SixBar />
      </div>
      <Footer />
    </div>
  );
}
}

export default LangingPage;
