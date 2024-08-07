import { IMailOrderdata } from "types/orders";


export const orderClientTemplate = (data: IMailOrderdata) => {
  const {
    owner_name,
    owner_phone,
    owner_email,
    isShipping,
    shipping_city,
    shipping_point,
    total_price,
    promocode,
    discounted_price,
    shipping_price,
    order_details,
  } = data;
  const item = order_details;
  const shippingAdress = isShipping
    ? `<p style="
    margin: 0;
    mso-line-height-rule: exactly;
    font-family: arial, 'helvetica neue',
      helvetica, sans-serif;
    line-height: 21px;
    letter-spacing: 0;
    color: #333333;
    font-size: 14px;
  "
  >
  Адрес доставки: ${shipping_city.city}, ${shipping_point.name}, ${shipping_point.location.address}
  </p>`
    : "";
  const shipping = isShipping ? "Доставка СДЭК (до ПВЗ)" : "Самовывоз из студии";
  const freeShipping = data.promocode.mechanic === 'freeShipping'? true:false;
  const shippingPrice = isShipping
    ? ` <p
  style="
    margin: 0;
    mso-line-height-rule: exactly;
    font-family: arial, 'helvetica neue',
      helvetica, sans-serif;
    line-height: 21px;
    letter-spacing: 0;
    color: #333333;
    font-size: 14px;
  "
>
  Стоимость доставки: ${shipping_price} Р
</p>
<p
style="
  margin: 0;
  mso-line-height-rule: exactly;
  font-family: arial, 'helvetica neue',
    helvetica, sans-serif;
  line-height: 21px;
  letter-spacing: 0;
  color: #333333;
  font-size: 14px;
"
>
Полная стоимость:&nbsp; ${total_price + shipping_price} Р
</p>`
    : ``;

  const shippingPromo =
    promocode.name != ""
      ? `<p
style="
  margin: 0;
  mso-line-height-rule: exactly;
  font-family: arial, 'helvetica neue',
    helvetica, sans-serif;
  line-height: 21px;
  letter-spacing: 0;
  color: #333333;
  font-size: 14px;
"
>
Промокод: ${promocode.name}
</p>`
      : ``;

  const discountedPrice =
    promocode.name != ""
      ? `<p
style="
  margin: 0;
  mso-line-height-rule: exactly;
  font-family: arial, 'helvetica neue',
    helvetica, sans-serif;
  line-height: 21px;
  letter-spacing: 0;
  color: #333333;
  font-size: 14px;
"
>
Стоимость со скидкой:&nbsp; ${discounted_price} Р
</p>`
      : "";

  const qtaSizes = (arr: any[]) => {
    let sizes = "";
    arr.forEach((item, index) => {
      if (item.userQty > 0) {
        sizes += `${item.name}:${item.userQty}шт, `;
      }
    });
    sizes = sizes.substring(0, sizes.length - 2) + ".";
    return sizes;
  };
  const getPreview = (item: string) => {
    let preview =
      "";
    if (item != "") {
      preview = item.slice(
        item.indexOf("Превью: ") + 8,
        item.indexOf("; Размер")
      );
    }
    return preview;
  };
  const getPrintFile = (item: string) => {
    let file =
      "";
    if (item != "") {
      file = item.slice(
        item.indexOf("Файл: ") + 6,
        item.indexOf(", Превью:")
      );
    }

    if (file !== "") {
      return `https://pnhdstudioapi.ru${file}`;
    } else {
      return file;
    }
  };
  const itemTemplate = (
    name: string,
    qtyAll: number,
    sizes: string,
    index: number,
    frontPrint: string,
    backPrint: string,
    lsleevePrint: string,
    rsleevePrint: string,
    frontPrintStr: string,
    backPrintStr: string,
    lsleevePrintStr: string,
    rsleevePrintStr: string,
    frontPrintFile: string,
    backPrintFile: string,
    lsleevePrintFile: string,
    rsleevePrintFile: string
  ) => {
    const frontPrintLink = frontPrintFile != "" ? `<table
    cellpadding="0"
    cellspacing="0"
    width="100%"
    role="presentation"
    style="
    mso-table-lspace: 0pt;
    mso-table-rspace: 0pt;
    border-collapse: collapse;
    border-spacing: 0px;
    "
    >
    <tr>
    <td
      align="center"
      style="padding: 0; margin: 0"
    >
      <!--[if mso
        ]><a href=${frontPrintFile} target="_blank" hidden>
          <v:roundrect
            xmlns:v="urn:schemas-microsoft-com:vml"
            xmlns:w="urn:schemas-microsoft-com:office:word"
            esdevVmlButton
            href=""
            style="
              height: 40px;
              v-text-anchor: middle;
              width: 89px;
            "
            arcsize="50%"
            strokecolor="#2cb543"
            strokeweight="1px"
            fillcolor="#00fd22"
          >
            <w:anchorlock></w:anchorlock>
            <center
              style="
                color: #ffffff;
                font-family: arial,
                  'helvetica neue', helvetica,
                  sans-serif;
                font-size: 14px;
                font-weight: 400;
                line-height: 14px;
                mso-text-raise: 1px;
              "
            >
              Грудь
            </center>
          </v:roundrect></a
        > <!
      [endif]--><!--[if !mso]--><!-- --><span
        class="es-button-border msohide"
        style="
          border-style: solid;
          border-color: #2cb543;
          background: #00fd22;
          border-width: 0px 0px 2px 0px;
          display: inline-block;
          border-radius: 30px;
          width: auto;
          mso-hide: all;
        "
        ><a
          href=${frontPrintFile}
          class="es-button"
          target="_blank"
          style="
            mso-style-priority: 100 !important;
            text-decoration: none !important;
            mso-line-height-rule: exactly;
            color: #ffffff;
            font-size: 18px;
            padding: 10px 20px 10px 20px;
            display: inline-block;
            background: #00fd22;
            border-radius: 30px;
            font-family: arial, 'helvetica neue',
              helvetica, sans-serif;
            font-weight: normal;
            font-style: normal;
            line-height: 22px;
            width: auto;
            text-align: center;
            letter-spacing: 0;
            mso-padding-alt: 0;
            mso-border-alt: 10px solid #00fd22;
          "
          >Грудь</a
        ></span
      ><!--<![endif]-->
    </td>
    </tr>
    </table>`: '';
    const backPrintLink = backPrintFile != "" ? `<table
    cellpadding="0"
    cellspacing="0"
    width="100%"
    role="presentation"
    style="
    mso-table-lspace: 0pt;
    mso-table-rspace: 0pt;
    border-collapse: collapse;
    border-spacing: 0px;
    "
    >
    <tr>
    <td
      align="center"
      style="padding: 0; margin: 0"
    >
      <!--[if mso
        ]><a href=${backPrintFile} target="_blank" hidden>
          <v:roundrect
            xmlns:v="urn:schemas-microsoft-com:vml"
            xmlns:w="urn:schemas-microsoft-com:office:word"
            esdevVmlButton
            href=""
            style="
              height: 40px;
              v-text-anchor: middle;
              width: 95px;
            "
            arcsize="50%"
            strokecolor="#2cb543"
            strokeweight="1px"
            fillcolor="#00fd22"
          >
            <w:anchorlock></w:anchorlock>
            <center
              style="
                color: #ffffff;
                font-family: arial,
                  'helvetica neue', helvetica,
                  sans-serif;
                font-size: 14px;
                font-weight: 400;
                line-height: 14px;
                mso-text-raise: 1px;
              "
            >
              Спина
            </center>
          </v:roundrect></a
        > <!
      [endif]--><!--[if !mso]--><!-- --><span
        class="es-button-border msohide"
        style="
          border-style: solid;
          border-color: #2cb543;
          background: #00fd22;
          border-width: 0px 0px 2px 0px;
          display: inline-block;
          border-radius: 30px;
          width: auto;
          mso-hide: all;
        "
        ><a
          href=${backPrintFile}
          class="es-button"
          target="_blank"
          style="
            mso-style-priority: 100 !important;
            text-decoration: none !important;
            mso-line-height-rule: exactly;
            color: #ffffff;
            font-size: 18px;
            padding: 10px 20px 10px 20px;
            display: inline-block;
            background: #00fd22;
            border-radius: 30px;
            font-family: arial, 'helvetica neue',
              helvetica, sans-serif;
            font-weight: normal;
            font-style: normal;
            line-height: 22px;
            width: auto;
            text-align: center;
            letter-spacing: 0;
            mso-padding-alt: 0;
            mso-border-alt: 10px solid #00fd22;
          "
          >Спина</a
        ></span
      ><!--<![endif]-->
    </td>
    </tr>
    </table>`: '';
    const lsleevePrintLink = lsleevePrintFile != "" ? `<table
    cellpadding="0"
    cellspacing="0"
    width="100%"
    role="presentation"
    style="
    mso-table-lspace: 0pt;
    mso-table-rspace: 0pt;
    border-collapse: collapse;
    border-spacing: 0px;
    "
    >
    <tr>
    <td
      align="center"
      style="padding: 0; margin: 0"
    >
      <!--[if mso
        ]><a href=${lsleevePrintFile} target="_blank" hidden>
          <v:roundrect
            xmlns:v="urn:schemas-microsoft-com:vml"
            xmlns:w="urn:schemas-microsoft-com:office:word"
            esdevVmlButton
            href=""
            style="
              height: 40px;
              v-text-anchor: middle;
              width: 111px;
            "
            arcsize="50%"
            strokecolor="#2cb543"
            strokeweight="1px"
            fillcolor="#00fd22"
          >
            <w:anchorlock></w:anchorlock>
            <center
              style="
                color: #ffffff;
                font-family: arial,
                  'helvetica neue', helvetica,
                  sans-serif;
                font-size: 14px;
                font-weight: 400;
                line-height: 14px;
                mso-text-raise: 1px;
              "
            >
              Л. рукав
            </center>
          </v:roundrect></a
        > <!
      [endif]--><!--[if !mso]--><!-- --><span
        class="es-button-border msohide"
        style="
          border-style: solid;
          border-color: #2cb543;
          background: #00fd22;
          border-width: 0px 0px 2px 0px;
          display: inline-block;
          border-radius: 30px;
          width: auto;
          mso-hide: all;
        "
        ><a
          href=${lsleevePrintFile}
          class="es-button"
          target="_blank"
          style="
            mso-style-priority: 100 !important;
            text-decoration: none !important;
            mso-line-height-rule: exactly;
            color: #ffffff;
            font-size: 18px;
            padding: 10px 20px 10px 20px;
            display: inline-block;
            background: #00fd22;
            border-radius: 30px;
            font-family: arial, 'helvetica neue',
              helvetica, sans-serif;
            font-weight: normal;
            font-style: normal;
            line-height: 22px;
            width: auto;
            text-align: center;
            letter-spacing: 0;
            mso-padding-alt: 0;
            mso-border-alt: 10px solid #00fd22;
          "
          >Л. рукав</a
        ></span
      ><!--<![endif]-->
    </td>
    </tr>
    </table>` : '';
    const rsleevePrintLink = rsleevePrintFile != "" ? `<table
    cellpadding="0"
    cellspacing="0"
    width="100%"
    role="presentation"
    style="
    mso-table-lspace: 0pt;
    mso-table-rspace: 0pt;
    border-collapse: collapse;
    border-spacing: 0px;
    "
    >
    <tr>
    <td
      align="center"
      style="padding: 0; margin: 0"
    >
      <!--[if mso
        ]><a href=${rsleevePrintFile} target="_blank" hidden>
          <v:roundrect
            xmlns:v="urn:schemas-microsoft-com:vml"
            xmlns:w="urn:schemas-microsoft-com:office:word"
            esdevVmlButton
            href=""
            style="
              height: 40px;
              v-text-anchor: middle;
              width: 112px;
            "
            arcsize="50%"
            strokecolor="#2cb543"
            strokeweight="1px"
            fillcolor="#00fd22"
          >
            <w:anchorlock></w:anchorlock>
            <center
              style="
                color: #ffffff;
                font-family: arial,
                  'helvetica neue', helvetica,
                  sans-serif;
                font-size: 14px;
                font-weight: 400;
                line-height: 14px;
                mso-text-raise: 1px;
              "
            >
              П. рукав
            </center>
          </v:roundrect></a
        > <!
      [endif]--><!--[if !mso]--><!-- --><span
        class="es-button-border msohide"
        style="
          border-style: solid;
          border-color: #2cb543;
          background: #00fd22;
          border-width: 0px 0px 2px 0px;
          display: inline-block;
          border-radius: 30px;
          width: auto;
          mso-hide: all;
        "
        ><a
          href=${rsleevePrintFile}
          class="es-button"
          target="_blank"
          style="
            mso-style-priority: 100 !important;
            text-decoration: none !important;
            mso-line-height-rule: exactly;
            color: #ffffff;
            font-size: 18px;
            padding: 10px 20px 10px 20px;
            display: inline-block;
            background: #00fd22;
            border-radius: 30px;
            font-family: arial, 'helvetica neue',
              helvetica, sans-serif;
            font-weight: normal;
            font-style: normal;
            line-height: 22px;
            width: auto;
            text-align: center;
            letter-spacing: 0;
            mso-padding-alt: 0;
            mso-border-alt: 10px solid #00fd22;
          "
          >П. рукав</a
        ></span
      ><!--<![endif]-->
    </td>
    </tr>
    </table>` : '';
    const getPrinSize = (elem:string) => {
      return elem.slice(elem.indexOf('Размер:')+8, elem.indexOf("см.")+2);
    }
    const one = frontPrint != '' ? 'грудь: '+getPrinSize(frontPrintStr)+', ':'';
    const two = backPrint != '' ? 'спина: '+getPrinSize(backPrintStr)+', ':'';
    const three = lsleevePrint != '' ? 'л.рукав: '+getPrinSize(lsleevePrintStr)+', ':'';
    const four = rsleevePrint != '' ? 'п.рукав: '+getPrinSize(rsleevePrintStr)+'.':'';

    const printingStr = one + two + three + four;

    return `<tr>
<td
  align="left"
  style="
    padding: 0;
    margin: 0;
    padding-top: 20px;
    padding-right: 20px;
    padding-left: 20px;
  "
>
  <table
    cellpadding="0"
    cellspacing="0"
    style="
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
      border-collapse: collapse;
      border-spacing: 0px;
    "
  >
    <tr>
      <td
        align="left"
        style="padding: 0; margin: 0; width: 560px"
      >
        <table
          cellpadding="0"
          cellspacing="0"
          width="100%"
          role="presentation"
          style="
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
            border-collapse: collapse;
            border-spacing: 0px;
          "
        >
<tr>
<td
  align="center"
  style="
    padding: 20px;
    margin: 0;
    font-size: 0;
  "
>
  <table
    border="0"
    width="100%"
    height="100%"
    cellpadding="0"
    cellspacing="0"
    class="es-spacer"
    role="presentation"
    style="
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
      border-collapse: collapse;
      border-spacing: 0px;
    "
  >
    <tr>
      <td
        style="
          padding: 0;
          margin: 0;
          border-bottom: 1px solid #cccccc;
          background: none;
          height: 1px;
          width: 100%;
          margin: 0px;
        "
      ></td>
    </tr>
  </table>
</td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>
<tr>
<td
align="left"
style="
padding: 0;
margin: 0;
padding-top: 20px;
padding-right: 20px;
padding-left: 20px;
"
>
<table
cellpadding="0"
cellspacing="0"
style="
mso-table-lspace: 0pt;
mso-table-rspace: 0pt;
border-collapse: collapse;
border-spacing: 0px;
"
>
<tr>
<td
align="left"
style="padding: 0; margin: 0; width: 560px"
>
<table
cellpadding="0"
cellspacing="0"
width="100%"
role="presentation"
style="
mso-table-lspace: 0pt;
mso-table-rspace: 0pt;
border-collapse: collapse;
border-spacing: 0px;
"
>
<tr>
<td
  align="left"
  style="padding: 0; margin: 0"
>
  <h2
    style="
      margin: 0;
      font-family: arial, 'helvetica neue',
        helvetica, sans-serif;
      mso-line-height-rule: exactly;
      letter-spacing: 0;
      font-size: 24px;
      font-style: normal;
      font-weight: normal;
      line-height: 29px;
      color: #333333;
    "
  >
    Товар № ${index + 1}
  </h2>
  <h2
    style="
      margin: 0;
      font-family: arial, 'helvetica neue',
        helvetica, sans-serif;
      mso-line-height-rule: exactly;
      letter-spacing: 0;
      font-size: 24px;
      font-style: normal;
      font-weight: normal;
      line-height: 29px;
      color: #333333;
    "
  >
    &nbsp;
  </h2>
  <p
    style="
      margin: 0;
      mso-line-height-rule: exactly;
      font-family: arial, 'helvetica neue',
        helvetica, sans-serif;
      line-height: 21px;
      letter-spacing: 0;
      color: #333333;
      font-size: 14px;
    "
  >
    Название: ${name}
  </p>
  <p
    style="
      margin: 0;
      mso-line-height-rule: exactly;
      font-family: arial, 'helvetica neue',
        helvetica, sans-serif;
      line-height: 21px;
      letter-spacing: 0;
      color: #333333;
      font-size: 14px;
    "
  >
    Общее количество: ${qtyAll}
  </p>
  <p
    style="
      margin: 0;
      mso-line-height-rule: exactly;
      font-family: arial, 'helvetica neue',
        helvetica, sans-serif;
      line-height: 21px;
      letter-spacing: 0;
      color: #333333;
      font-size: 14px;
    "
  >
    Количество по размерам: ${sizes}
  </p>
  <p
    style="
      margin: 0;
      mso-line-height-rule: exactly;
      font-family: arial, 'helvetica neue',
        helvetica, sans-serif;
      line-height: 21px;
      letter-spacing: 0;
      color: #333333;
      font-size: 14px;
    "
  >
    ${printingStr!=''?`Печать на: ${printingStr}`:''}
  </p>
  <p
    style="
      margin: 0;
      mso-line-height-rule: exactly;
      font-family: arial, 'helvetica neue',
        helvetica, sans-serif;
      line-height: 21px;
      letter-spacing: 0;
      color: #333333;
      font-size: 14px;
    "
  >
    &nbsp;
  </p>
</td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>
<tr>
<td
align="left"
style="
padding: 0;
margin: 0;
padding-top: 20px;
padding-right: 20px;
padding-left: 20px;
"
>
<!--[if mso]><table style="width:560px" cellpadding="0" cellspacing="0"><tr><td style="width:145px"><![endif]-->
<table
cellpadding="0"
cellspacing="0"
class="es-left"
align="left"
style="
mso-table-lspace: 0pt;
mso-table-rspace: 0pt;
border-collapse: collapse;
border-spacing: 0px;
float: left;
"
>
<tr>
<td
align="left"
style="padding: 0; margin: 0; width: 125px"
>
<table
cellpadding="0"
cellspacing="0"
width="100%"
role="presentation"
style="
mso-table-lspace: 0pt;
mso-table-rspace: 0pt;
border-collapse: collapse;
border-spacing: 0px;
"
>
<tr>
<td
  align="center"
  style="padding: 0; margin: 0; font-size: 0"
>
  <img
    class="adapt-img"
    src=${frontPrint}
    alt=""
    width="125"
    style="
      display: block;
      font-size: 14px;
      border: 0;
      outline: none;
      text-decoration: none;
    "
  />
</td>
</tr>
</table>
</td>
<td
class="es-hidden"
style="padding: 0; margin: 0; width: 20px"
></td>
</tr>
</table>
<!--[if mso]></td><td style="width:125px"><![endif]-->
<table
cellpadding="0"
cellspacing="0"
class="es-left"
align="left"
style="
mso-table-lspace: 0pt;
mso-table-rspace: 0pt;
border-collapse: collapse;
border-spacing: 0px;
float: left;
"
>
<tr>
<td
align="left"
style="padding: 0; margin: 0; width: 125px"
>
<table
cellpadding="0"
cellspacing="0"
width="100%"
role="presentation"
style="
mso-table-lspace: 0pt;
mso-table-rspace: 0pt;
border-collapse: collapse;
border-spacing: 0px;
"
>
<tr>
<td
  align="center"
  style="padding: 0; margin: 0; font-size: 0"
>
  <img
    class="adapt-img"
    src=${backPrint}
    alt=""
    width="125"
    style="
      display: block;
      font-size: 14px;
      border: 0;
      outline: none;
      text-decoration: none;
    "
  />
</td>
</tr>
</table>
</td>
<td
class="es-hidden"
style="padding: 0; margin: 0; width: 20px"
></td>
</tr>
</table>
<!--[if mso]></td><td style="width:20px"></td><td style="width:125px"><![endif]-->
<table
cellpadding="0"
cellspacing="0"
class="es-left"
align="left"
style="
mso-table-lspace: 0pt;
mso-table-rspace: 0pt;
border-collapse: collapse;
border-spacing: 0px;
float: left;
"
>
<tr>
<td
align="left"
style="padding: 0; margin: 0; width: 125px"
>
<table
cellpadding="0"
cellspacing="0"
width="100%"
role="presentation"
style="
mso-table-lspace: 0pt;
mso-table-rspace: 0pt;
border-collapse: collapse;
border-spacing: 0px;
"
>
<tr>
<td
  align="center"
  style="padding: 0; margin: 0; font-size: 0"
>
  <img
    class="adapt-img"
    src=${lsleevePrint}
    alt=""
    width="125"
    style="
      display: block;
      font-size: 14px;
      border: 0;
      outline: none;
      text-decoration: none;
    "
  />
</td>
</tr>
</table>
</td>
<td
class="es-hidden"
style="padding: 0; margin: 0; width: 20px"
></td>
</tr>
</table>
<!--[if mso]></td><td style="width:20px"></td><td style="width:125px"><![endif]-->
<table
cellpadding="0"
cellspacing="0"
class="es-right"
align="right"
style="
mso-table-lspace: 0pt;
mso-table-rspace: 0pt;
border-collapse: collapse;
border-spacing: 0px;
float: left;
"
>
<tr>
<td
align="left"
style="padding: 0; margin: 0; width: 125px"
>
<table
cellpadding="0"
cellspacing="0"
width="100%"
role="presentation"
style="
mso-table-lspace: 0pt;
mso-table-rspace: 0pt;
border-collapse: collapse;
border-spacing: 0px;
"
>
<tr>
<td
  align="center"
  style="padding: 0; margin: 0; font-size: 0"
>
  <img
    class="adapt-img"
    src=${rsleevePrint}
    alt=""
    width="125"
    style="
      display: block;
      font-size: 14px;
      border: 0;
      outline: none;
      text-decoration: none;
    "
  />
</td>
</tr>
</table>
</td>
</tr>
</table>
<!--[if mso]></td></tr></table><![endif]-->
</td>
</tr>
<tr>
<td
align="left"
style="
padding: 0;
margin: 0;
padding-top: 20px;
padding-right: 20px;
padding-left: 20px;
"
>
<!--[if mso]><table style="width:560px" cellpadding="0" cellspacing="0"><tr><td style="width:145px"><![endif]-->
<table
cellpadding="0"
cellspacing="0"
class="es-left"
align="left"
style="
mso-table-lspace: 0pt;
mso-table-rspace: 0pt;
border-collapse: collapse;
border-spacing: 0px;
float: left;
"
>
<tr>
<td
align="left"
style="padding: 0; margin: 0; width: 125px"
>
${frontPrintLink}
</td>
<td
class="es-hidden"
style="padding: 0; margin: 0; width: 20px"
></td>
</tr>
</table>
<!--[if mso]></td><td style="width:125px"><![endif]-->
<table
cellpadding="0"
cellspacing="0"
class="es-left"
align="left"
style="
mso-table-lspace: 0pt;
mso-table-rspace: 0pt;
border-collapse: collapse;
border-spacing: 0px;
float: left;
"
>
<tr>
<td
align="left"
style="padding: 0; margin: 0; width: 125px"
>
${backPrintLink}
</td>
<td
class="es-hidden"
style="padding: 0; margin: 0; width: 20px"
></td>
</tr>
</table>
<!--[if mso]></td><td style="width:20px"></td><td style="width:125px"><![endif]-->
<table
cellpadding="0"
cellspacing="0"
class="es-left"
align="left"
style="
mso-table-lspace: 0pt;
mso-table-rspace: 0pt;
border-collapse: collapse;
border-spacing: 0px;
float: left;
"
>
<tr>
<td
align="left"
style="padding: 0; margin: 0; width: 125px"
>
${lsleevePrintLink}
<td
class="es-hidden"
style="padding: 0; margin: 0; width: 20px"
></td>
</td>
</tr>
</table>
<!--[if mso]></td><td style="width:20px"></td><td style="width:125px"><![endif]-->
<table
cellpadding="0"
cellspacing="0"
class="es-left"
align="left"
style="
mso-table-lspace: 0pt;
mso-table-rspace: 0pt;
border-collapse: collapse;
border-spacing: 0px;
float: left;
"
>
<tr>
<td
align="left"
style="padding: 0; margin: 0; width: 125px"
>
${rsleevePrintLink}
</td>
</tr>
</table>
<!--[if mso]></td></tr></table><![endif]-->
</td>
</tr>
`;
  };
  const itemTemplateWithoutPrints = (
    name: string,
    qtyAll: number,
    sizes: string,
    index: number
  ) => {
    return `<tr>
<td
  align="left"
  style="
    padding: 0;
    margin: 0;
    padding-top: 20px;
    padding-right: 20px;
    padding-left: 20px;
  "
>
  <table
    cellpadding="0"
    cellspacing="0"
    style="
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
      border-collapse: collapse;
      border-spacing: 0px;
    "
  >
    <tr>
      <td
        align="left"
        style="padding: 0; margin: 0; width: 560px"
      >
        <table
          cellpadding="0"
          cellspacing="0"
          width="100%"
          role="presentation"
          style="
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
            border-collapse: collapse;
            border-spacing: 0px;
          "
        >
<tr>
<td
  align="center"
  style="
    padding: 20px;
    margin: 0;
    font-size: 0;
  "
>
  <table
    border="0"
    width="100%"
    height="100%"
    cellpadding="0"
    cellspacing="0"
    class="es-spacer"
    role="presentation"
    style="
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
      border-collapse: collapse;
      border-spacing: 0px;
    "
  >
    <tr>
      <td
        style="
          padding: 0;
          margin: 0;
          border-bottom: 1px solid #cccccc;
          background: none;
          height: 1px;
          width: 100%;
          margin: 0px;
        "
      ></td>
    </tr>
  </table>
</td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>
<tr>
<td
align="left"
style="
padding: 0;
margin: 0;
padding-top: 20px;
padding-right: 20px;
padding-left: 20px;
"
>
<table
cellpadding="0"
cellspacing="0"
style="
mso-table-lspace: 0pt;
mso-table-rspace: 0pt;
border-collapse: collapse;
border-spacing: 0px;
"
>
<tr>
<td
align="left"
style="padding: 0; margin: 0; width: 560px"
>
<table
cellpadding="0"
cellspacing="0"
width="100%"
role="presentation"
style="
mso-table-lspace: 0pt;
mso-table-rspace: 0pt;
border-collapse: collapse;
border-spacing: 0px;
"
>
<tr>
<td
  align="left"
  style="padding: 0; margin: 0"
>
  <h2
    style="
      margin: 0;
      font-family: arial, 'helvetica neue',
        helvetica, sans-serif;
      mso-line-height-rule: exactly;
      letter-spacing: 0;
      font-size: 24px;
      font-style: normal;
      font-weight: normal;
      line-height: 29px;
      color: #333333;
    "
  >
    Товар № ${index + 1}
  </h2>
  <h2
    style="
      margin: 0;
      font-family: arial, 'helvetica neue',
        helvetica, sans-serif;
      mso-line-height-rule: exactly;
      letter-spacing: 0;
      font-size: 24px;
      font-style: normal;
      font-weight: normal;
      line-height: 29px;
      color: #333333;
    "
  >
    &nbsp;
  </h2>
  <p
    style="
      margin: 0;
      mso-line-height-rule: exactly;
      font-family: arial, 'helvetica neue',
        helvetica, sans-serif;
      line-height: 21px;
      letter-spacing: 0;
      color: #333333;
      font-size: 14px;
    "
  >
    Название: ${name}
  </p>
  <p
    style="
      margin: 0;
      mso-line-height-rule: exactly;
      font-family: arial, 'helvetica neue',
        helvetica, sans-serif;
      line-height: 21px;
      letter-spacing: 0;
      color: #333333;
      font-size: 14px;
    "
  >
    Общее количество: ${qtyAll}
  </p>
  <p
    style="
      margin: 0;
      mso-line-height-rule: exactly;
      font-family: arial, 'helvetica neue',
        helvetica, sans-serif;
      line-height: 21px;
      letter-spacing: 0;
      color: #333333;
      font-size: 14px;
    "
  >
    Количество по размерам: ${sizes}
  </p>
  <p
    style="
      margin: 0;
      mso-line-height-rule: exactly;
      font-family: arial, 'helvetica neue',
        helvetica, sans-serif;
      line-height: 21px;
      letter-spacing: 0;
      color: #333333;
      font-size: 14px;
    "
  >
    &nbsp;
  </p>
</td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>
<tr>
<td
align="left"
style="
padding: 0;
margin: 0;
padding-top: 20px;
padding-right: 20px;
padding-left: 20px;
"
>
<!--[if mso]><table style="width:560px" cellpadding="0" cellspacing="0"><tr><td style="width:145px"><![endif]-->
<table
cellpadding="0"
cellspacing="0"
class="es-left"
align="left"
style="
mso-table-lspace: 0pt;
mso-table-rspace: 0pt;
border-collapse: collapse;
border-spacing: 0px;
float: left;
"
>
<tr>
<td
class="es-hidden"
style="padding: 0; margin: 0; width: 20px"
></td>
</tr>
</table></td>
</tr>


`;
  };
  const setItem = () => {
    let product = "";
    item.forEach((elem: any, index: number) => {
      //console.log(elem.qty);
      let sizes = qtaSizes(elem.qty);
      if (elem.isForPrinting) {
        let frontPrint = getPreview(elem.front_print);
        let backPrint = getPreview(elem.back_print);
        let lsleevePrint = getPreview(elem.lsleeve_print);
        let rsleevePrint = getPreview(elem.rsleeve_print);
        let frontPrintStr = elem.front_print;
        let backPrintStr = elem.back_print;
        let lsleevePrintStr = elem.lsleeve_print;
        let rsleevePrintStr = elem.rsleeve_print;
        let frontPrintFile = getPrintFile(elem.front_print);
        let backPrintFile = getPrintFile(elem.back_print);
        let lsleevePrintFile = getPrintFile(elem.lsleeve_print);
        let rsleevePrintFile = getPrintFile(elem.rsleeve_print);


        product += itemTemplate(
          elem.name,
          elem.qtyAll,
          sizes,
          index,
          frontPrint,
          backPrint,
          lsleevePrint,
          rsleevePrint,
          frontPrintStr,
          backPrintStr,
          lsleevePrintStr,
          rsleevePrintStr,
          frontPrintFile,
          backPrintFile,
          lsleevePrintFile,
          rsleevePrintFile
        );
      } else {
        product += itemTemplateWithoutPrints(
          elem.name,
          elem.qtyAll,
          sizes,
          index
        );
      }
    });
    return product;
  };

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html
    xmlns="http://www.w3.org/1999/xhtml"
    xmlns:o="urn:schemas-microsoft-com:office:office"
  >
    <head>
      <meta charset="UTF-8" />
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta name="x-apple-disable-message-reformatting" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta content="telephone=no" name="format-detection" />
      <title>Новое письмо</title>
      <!--[if (mso 16)]>
        <style type="text/css">
          a {
            text-decoration: none;
          }
        </style>
      <![endif]-->
      <!--[if gte mso 9
        ]><style>
          sup {
            font-size: 100% !important;
          }
        </style><!
      [endif]-->
      <!--[if gte mso 9]>
        <xml>
          <o:OfficeDocumentSettings>
            <o:AllowPNG></o:AllowPNG>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      <![endif]-->
      <style type="text/css">
        .rollover:hover .rollover-first {
          max-height: 0px !important;
          display: none !important;
        }
        .rollover:hover .rollover-second {
          max-height: none !important;
          display: inline-block !important;
        }
        .rollover div {
          font-size: 0px;
        }
        u ~ div img + div > div {
          display: none;
        }
        #outlook a {
          padding: 0;
        }
        span.MsoHyperlink,
        span.MsoHyperlinkFollowed {
          color: inherit;
          mso-style-priority: 99;
        }
        a.es-button {
          mso-style-priority: 100 !important;
          text-decoration: none !important;
        }
        a[x-apple-data-detectors] {
          color: inherit !important;
          text-decoration: none !important;
          font-size: inherit !important;
          font-family: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
        }
        .es-desk-hidden {
          display: none;
          float: left;
          overflow: hidden;
          width: 0;
          max-height: 0;
          line-height: 0;
          mso-hide: all;
        }
        .es-header-body a:hover {
          color: #2cb543 !important;
        }
        .es-content-body a:hover {
          color: #2cb543 !important;
        }
        .es-footer-body a:hover {
          color: #ffffff !important;
        }
        .es-infoblock a:hover {
          color: #cccccc !important;
        }
        .es-button-border:hover {
          border-color: #42d159 #42d159 #42d159 #42d159 !important;
          background: #56d66b !important;
        }
        .es-button-border:hover a.es-button,
        .es-button-border:hover button.es-button {
          background: #56d66b !important;
        }
        @media only screen and (max-width: 600px) {
          *[class="gmail-fix"] {
            display: none !important;
          }
          p,
          a {
            line-height: 150% !important;
          }
          h1,
          h1 a {
            line-height: 120% !important;
          }
          h2,
          h2 a {
            line-height: 120% !important;
          }
          h3,
          h3 a {
            line-height: 120% !important;
          }
          h4,
          h4 a {
            line-height: 120% !important;
          }
          h5,
          h5 a {
            line-height: 120% !important;
          }
          h6,
          h6 a {
            line-height: 120% !important;
          }
          .es-header-body p {
          }
          .es-content-body p {
          }
          .es-footer-body p {
          }
          .es-infoblock p {
          }
          h1 {
            font-size: 30px !important;
            text-align: left;
          }
          h2 {
            font-size: 24px !important;
            text-align: left;
          }
          h3 {
            font-size: 20px !important;
            text-align: left;
          }
          h4 {
            font-size: 24px !important;
            text-align: left;
          }
          h5 {
            font-size: 20px !important;
            text-align: left;
          }
          h6 {
            font-size: 16px !important;
            text-align: left;
          }
          .es-header-body h1 a,
          .es-content-body h1 a,
          .es-footer-body h1 a {
            font-size: 30px !important;
          }
          .es-header-body h2 a,
          .es-content-body h2 a,
          .es-footer-body h2 a {
            font-size: 24px !important;
          }
          .es-header-body h3 a,
          .es-content-body h3 a,
          .es-footer-body h3 a {
            font-size: 20px !important;
          }
          .es-header-body h4 a,
          .es-content-body h4 a,
          .es-footer-body h4 a {
            font-size: 24px !important;
          }
          .es-header-body h5 a,
          .es-content-body h5 a,
          .es-footer-body h5 a {
            font-size: 20px !important;
          }
          .es-header-body h6 a,
          .es-content-body h6 a,
          .es-footer-body h6 a {
            font-size: 16px !important;
          }
          .es-menu td a {
            font-size: 14px !important;
          }
          .es-header-body p,
          .es-header-body a {
            font-size: 14px !important;
          }
          .es-content-body p,
          .es-content-body a {
            font-size: 14px !important;
          }
          .es-footer-body p,
          .es-footer-body a {
            font-size: 14px !important;
          }
          .es-infoblock p,
          .es-infoblock a {
            font-size: 12px !important;
          }
          .es-m-txt-c,
          .es-m-txt-c h1,
          .es-m-txt-c h2,
          .es-m-txt-c h3,
          .es-m-txt-c h4,
          .es-m-txt-c h5,
          .es-m-txt-c h6 {
            text-align: center !important;
          }
          .es-m-txt-r,
          .es-m-txt-r h1,
          .es-m-txt-r h2,
          .es-m-txt-r h3,
          .es-m-txt-r h4,
          .es-m-txt-r h5,
          .es-m-txt-r h6 {
            text-align: right !important;
          }
          .es-m-txt-j,
          .es-m-txt-j h1,
          .es-m-txt-j h2,
          .es-m-txt-j h3,
          .es-m-txt-j h4,
          .es-m-txt-j h5,
          .es-m-txt-j h6 {
            text-align: justify !important;
          }
          .es-m-txt-l,
          .es-m-txt-l h1,
          .es-m-txt-l h2,
          .es-m-txt-l h3,
          .es-m-txt-l h4,
          .es-m-txt-l h5,
          .es-m-txt-l h6 {
            text-align: left !important;
          }
          .es-m-txt-r img,
          .es-m-txt-c img,
          .es-m-txt-l img,
          .es-m-txt-r .rollover:hover .rollover-second,
          .es-m-txt-c .rollover:hover .rollover-second,
          .es-m-txt-l .rollover:hover .rollover-second {
            display: inline !important;
          }
          .es-m-txt-r .rollover div,
          .es-m-txt-c .rollover div,
          .es-m-txt-l .rollover div {
            line-height: 0 !important;
            font-size: 0 !important;
          }
          .es-spacer {
            display: inline-table;
          }
          a.es-button,
          button.es-button {
            font-size: 18px !important;
          }
          .es-m-fw,
          .es-m-fw.es-fw,
          .es-m-fw .es-button {
            display: block !important;
          }
          .es-m-il,
          .es-m-il .es-button,
          .es-social,
          .es-social td,
          .es-menu {
            display: inline-block !important;
          }
          .es-adaptive table,
          .es-left,
          .es-right {
            width: 100% !important;
          }
          .es-content table,
          .es-header table,
          .es-footer table,
          .es-content,
          .es-footer,
          .es-header {
            width: 100% !important;
            max-width: 600px !important;
          }
          .adapt-img {
            width: 100% !important;
            height: auto !important;
          }
          .es-mobile-hidden,
          .es-hidden {
            display: none !important;
          }
          .es-desk-hidden {
            width: auto !important;
            overflow: visible !important;
            float: none !important;
            max-height: inherit !important;
            line-height: inherit !important;
          }
          tr.es-desk-hidden {
            display: table-row !important;
          }
          table.es-desk-hidden {
            display: table !important;
          }
          td.es-desk-menu-hidden {
            display: table-cell !important;
          }
          .es-menu td {
            width: 1% !important;
          }
          table.es-table-not-adapt,
          .esd-block-html table {
            width: auto !important;
          }
          .es-social td {
            padding-bottom: 10px;
          }
          .h-auto {
            height: auto !important;
          }
          a.es-button,
          button.es-button {
            display: inline-block !important;
          }
          .es-button-border {
            display: inline-block !important;
          }
        }
      </style>
    </head>
    <body style="width: 100%; height: 100%; padding: 0; margin: 0">
      <div class="es-wrapper-color" style="background-color: #f6f6f6">
        <!--[if gte mso 9]>
          <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
            <v:fill type="tile" color="#f6f6f6"></v:fill>
          </v:background>
        <![endif]-->
        <table
          class="es-wrapper"
          width="100%"
          cellspacing="0"
          cellpadding="0"
          style="
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
            border-collapse: collapse;
            border-spacing: 0px;
            padding: 0;
            margin: 0;
            width: 100%;
            height: 100%;
            background-repeat: repeat;
            background-position: center top;
            background-color: #f6f6f6;
          "
        >
          <tr>
            <td valign="top" style="padding: 0; margin: 0">
              <table
                class="es-content"
                cellspacing="0"
                cellpadding="0"
                align="center"
                style="
                  mso-table-lspace: 0pt;
                  mso-table-rspace: 0pt;
                  border-collapse: collapse;
                  border-spacing: 0px;
                  width: 100%;
                  table-layout: fixed !important;
                "
              >
                <tr>
                  <td align="center" style="padding: 0; margin: 0">
                    <table
                      class="es-content-body"
                      cellspacing="0"
                      cellpadding="0"
                      bgcolor="#ffffff"
                      align="center"
                      style="
                        mso-table-lspace: 0pt;
                        mso-table-rspace: 0pt;
                        border-collapse: collapse;
                        border-spacing: 0px;
                        background-color: #ffffff;
                        width: 600px;
                      "
                    >
                      <tr>
                        <td
                          align="left"
                          style="
                            padding: 0;
                            margin: 0;
                            padding-top: 20px;
                            padding-right: 20px;
                            padding-left: 20px;
                          "
                        >
                          <table
                            width="100%"
                            cellspacing="0"
                            cellpadding="0"
                            style="
                              mso-table-lspace: 0pt;
                              mso-table-rspace: 0pt;
                              border-collapse: collapse;
                              border-spacing: 0px;
                            "
                          >
                            <tr>
                              <td
                                valign="top"
                                align="center"
                                style="padding: 0; margin: 0; width: 560px"
                              >
                                <table
                                  width="100%"
                                  cellspacing="0"
                                  cellpadding="0"
                                  role="presentation"
                                  style="
                                    mso-table-lspace: 0pt;
                                    mso-table-rspace: 0pt;
                                    border-collapse: collapse;
                                    border-spacing: 0px;
                                  "
                                >
                                  <tr>
                                    <td
                                      align="center"
                                      style="padding: 0; margin: 0"
                                    >
                                      <h1
                                        style="
                                          margin: 0;
                                          font-family: helvetica, 'helvetica neue',
                                            arial, verdana, sans-serif;
                                          mso-line-height-rule: exactly;
                                          letter-spacing: 0;
                                          font-size: 30px;
                                          font-style: normal;
                                          font-weight: normal;
                                          line-height: 36px;
                                          color: #333333;
                                        "
                                      >
                                        <span style="font-size: 20px !important"
                                          >PINHEAD STUDIO | НОВЫЙ ЗАКАЗ​</span
                                        >
                                      </h1>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <table
                class="es-footer"
                cellspacing="0"
                cellpadding="0"
                align="center"
                style="
                  mso-table-lspace: 0pt;
                  mso-table-rspace: 0pt;
                  border-collapse: collapse;
                  border-spacing: 0px;
                  width: 100%;
                  table-layout: fixed !important;
                  background-color: transparent;
                  background-repeat: repeat;
                  background-position: center top;
                "
              >
                <tr>
                  <td align="center" style="padding: 0; margin: 0">
                    <table
                      class="es-footer-body"
                      cellspacing="0"
                      cellpadding="0"
                      bgcolor="#ffffff"
                      align="center"
                      style="
                        mso-table-lspace: 0pt;
                        mso-table-rspace: 0pt;
                        border-collapse: collapse;
                        border-spacing: 0px;
                        background-color: #ffffff;
                        width: 600px;
                      "
                    >
                      <tr>
                        <td
                          align="left"
                          style="
                            padding: 0;
                            margin: 0;
                            padding-top: 20px;
                            padding-right: 20px;
                            padding-left: 20px;
                          "
                        >
                          <table
                            cellpadding="0"
                            cellspacing="0"
                            style="
                              mso-table-lspace: 0pt;
                              mso-table-rspace: 0pt;
                              border-collapse: collapse;
                              border-spacing: 0px;
                            "
                          >
                            <tr>
                              <td
                                align="left"
                                style="padding: 0; margin: 0; width: 560px"
                              >
                                <table
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  role="presentation"
                                  style="
                                    mso-table-lspace: 0pt;
                                    mso-table-rspace: 0pt;
                                    border-collapse: collapse;
                                    border-spacing: 0px;
                                  "
                                >
                                  <tr>
                                    <td
                                      align="left"
                                      style="padding: 0; margin: 0"
                                    >
                                      <p
                                        style="
                                          margin: 0;
                                          mso-line-height-rule: exactly;
                                          font-family: arial, 'helvetica neue',
                                            helvetica, sans-serif;
                                          line-height: 21px;
                                          letter-spacing: 0;
                                          color: #333333;
                                          font-size: 14px;
                                        "
                                      >
                                        ФИО:&nbsp; ${owner_name}
                                      </p>
                                      <p
                                        style="
                                          margin: 0;
                                          mso-line-height-rule: exactly;
                                          font-family: arial, 'helvetica neue',
                                            helvetica, sans-serif;
                                          line-height: 21px;
                                          letter-spacing: 0;
                                          color: #333333;
                                          font-size: 14px;
                                        "
                                      >
                                        Телефон: ${owner_phone}
                                      </p>
                                      <p
                                        style="
                                          margin: 0;
                                          mso-line-height-rule: exactly;
                                          font-family: arial, 'helvetica neue',
                                            helvetica, sans-serif;
                                          line-height: 21px;
                                          letter-spacing: 0;
                                          color: #333333;
                                          font-size: 14px;
                                        "
                                      >
                                        Emai: ${owner_email}
                                      </p>
                                      <p
                                        style="
                                          margin: 0;
                                          mso-line-height-rule: exactly;
                                          font-family: arial, 'helvetica neue',
                                            helvetica, sans-serif;
                                          line-height: 21px;
                                          letter-spacing: 0;
                                          color: #333333;
                                          font-size: 14px;
                                        "
                                      >
                                        Доставка: ${shipping}
                                      </p>
                                      ${shippingAdress}
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td
                          align="left"
                          style="
                            padding: 0;
                            margin: 0;
                            padding-top: 20px;
                            padding-right: 20px;
                            padding-left: 20px;
                          "
                        >
                          <table
                            cellpadding="0"
                            cellspacing="0"
                            style="
                              mso-table-lspace: 0pt;
                              mso-table-rspace: 0pt;
                              border-collapse: collapse;
                              border-spacing: 0px;
                            "
                          >
                            <tr>
                              <td
                                align="left"
                                style="padding: 0; margin: 0; width: 560px"
                              >
                                <table
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  role="presentation"
                                  style="
                                    mso-table-lspace: 0pt;
                                    mso-table-rspace: 0pt;
                                    border-collapse: collapse;
                                    border-spacing: 0px;
                                  "
                                >
                                  <tr>
                                    <td
                                      align="center"
                                      style="
                                        padding: 20px;
                                        margin: 0;
                                        font-size: 0;
                                      "
                                    >
                                      <table
                                        border="0"
                                        width="100%"
                                        height="100%"
                                        cellpadding="0"
                                        cellspacing="0"
                                        class="es-spacer"
                                        role="presentation"
                                        style="
                                          mso-table-lspace: 0pt;
                                          mso-table-rspace: 0pt;
                                          border-collapse: collapse;
                                          border-spacing: 0px;
                                        "
                                      >
                                        <tr>
                                          <td
                                            style="
                                              padding: 0;
                                              margin: 0;
                                              border-bottom: 1px solid #cccccc;
                                              background: none;
                                              height: 1px;
                                              width: 100%;
                                              margin: 0px;
                                            "
                                          ></td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td
                          align="left"
                          style="
                            padding: 0;
                            margin: 0;
                            padding-top: 20px;
                            padding-right: 20px;
                            padding-left: 20px;
                          "
                        >
                          <table
                            cellpadding="0"
                            cellspacing="0"
                            style="
                              mso-table-lspace: 0pt;
                              mso-table-rspace: 0pt;
                              border-collapse: collapse;
                              border-spacing: 0px;
                            "
                          >
                            <tr>
                              <td
                                align="left"
                                style="padding: 0; margin: 0; width: 560px"
                              >
                                <table
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  role="presentation"
                                  style="
                                    mso-table-lspace: 0pt;
                                    mso-table-rspace: 0pt;
                                    border-collapse: collapse;
                                    border-spacing: 0px;
                                  "
                                >
                                  <tr>
                                    <td
                                      align="left"
                                      style="padding: 0; margin: 0"
                                    >
                                      <p
                                        style="
                                          margin: 0;
                                          mso-line-height-rule: exactly;
                                          font-family: arial, 'helvetica neue',
                                            helvetica, sans-serif;
                                          line-height: 21px;
                                          letter-spacing: 0;
                                          color: #333333;
                                          font-size: 14px;
                                        "
                                      >
                                        Стоимость заказа: ${total_price} Р
                                      </p>
                                     ${!freeShipping?shippingPrice:``}
                                     ${shippingPromo}
                                     ${discountedPrice}
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                                ${setItem()}
                                <tr>
<td
align="left"
style="
padding: 0;
margin: 0;
padding-top: 20px;
padding-right: 20px;
padding-left: 20px;
"
>
<table
cellpadding="0"
cellspacing="0"
style="
mso-table-lspace: 0pt;
mso-table-rspace: 0pt;
border-collapse: collapse;
border-spacing: 0px;
"
>
                            <tr>
                              <td
                                align="left"
                                style="padding: 0; margin: 0; width: 560px"
                              >
                                <table
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  role="presentation"
                                  style="
                                    mso-table-lspace: 0pt;
                                    mso-table-rspace: 0pt;
                                    border-collapse: collapse;
                                    border-spacing: 0px;
                                  "
                                >
                                  <tr>
                                    <td
                                      align="center"
                                      style="padding: 0; margin: 0"
                                    >
                                      <p
                                        style="
                                          margin: 0;
                                          mso-line-height-rule: exactly;
                                          font-family: arial, 'helvetica neue',
                                            helvetica, sans-serif;
                                          line-height: 21px;
                                          letter-spacing: 0;
                                          color: #333333;
                                          font-size: 14px;
                                        "
                                      >
                                        Спасибо за ваш заказ! Мы скоро свяжемся с
                                        вами для подтверждения деталей принтов и
                                        сроков выполнения заказа!&nbsp;
                                      </p>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td
                          align="left"
                          style="
                            padding: 0;
                            margin: 0;
                            padding-top: 20px;
                            padding-right: 20px;
                            padding-left: 20px;
                          "
                        >
                          <table
                            cellpadding="0"
                            cellspacing="0"
                            style="
                              mso-table-lspace: 0pt;
                              mso-table-rspace: 0pt;
                              border-collapse: collapse;
                              border-spacing: 0px;
                            "
                          >
                            <tr>
                              <td
                                align="left"
                                style="padding: 0; margin: 0; width: 560px"
                              >
                                <table
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  role="presentation"
                                  style="
                                    mso-table-lspace: 0pt;
                                    mso-table-rspace: 0pt;
                                    border-collapse: collapse;
                                    border-spacing: 0px;
                                  "
                                >
                                  <tr>
                                    <td
                                      align="center"
                                      style="padding: 0; margin: 0"
                                    >
                                      <p
                                        style="
                                          margin: 0;
                                          mso-line-height-rule: exactly;
                                          font-family: arial, 'helvetica neue',
                                            helvetica, sans-serif;
                                          line-height: 18px;
                                          letter-spacing: 0;
                                          color: #333333;
                                          font-size: 12px !important;
                                        "
                                      >
                                        PINHEAD STUDIO | +79313566552 |
                                        studio@pnhd.ru
                                      </p>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    </body>
  </html>
  `;
};
