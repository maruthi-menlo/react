import { Component, OnInit } from '@angular/core';
import * as $ from "jquery";
declare var powerbi:any
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {


  constructor() { }

  ngOnInit() {
    var reportId = "085639ea-54c1-4ac0-9c22-4bfb6e5c9c03"
  
    var embedUrl = "https://app.powerbi.com/reportEmbed?reportId=085639ea-54c1-4ac0-9c22-4bfb6e5c9c03&amp;groupId=320684ca-07a9-417c-8168-ad8484cee4b8"
    
    var embedToken = "H4sIAAAAAAAEACWWtc7GirVE3-W0jmSmSCnMzOzOzPZnhui--_2l9FMtzV57_vuPnb3jkpX__PufE6FsmHXIHw03jrcZM8wKU_2zxlPWXHhPzabfmq4C0NJ0v0mZTOW2tzb-3oDLeo95wAc9i-Z-AjaqTXp-KqlqA2tiE13NxwbXEaufo8yw-yBjt7deZWnqjuMJzngfbAlvibZl4sDv4BkNm2aNH7E-cdufjQH94Q4jkl08xGfuFLKF63eIX7toxmC83Kavl1TRlFMPbzv1daRb0UOkGad1gwYAGEY9Ee5T4CdgDlv1Uiof8DcUhn4xFcDze5U7BW2VW4gmXyLZp1GkQp31ydduhWR-0abs6RPfNejDPeQM2kXM5MbctVpX8-RGf0ZONg-keNJLl23nZh16MFiv92zplF6TrrclR6cpj5RSFttbZ_RhTdTl92aW9tB6V-lxZYGuaSeilqleJcwUwsniRRiCmiN6pOoGHo7wp0cOkxYj0i47SreoZcWJMul9EPq4fjXJJQnV1tqupNuFWlVqhjse1_7ONdFR2YT5_eFKdBKn57etDKJmZ1Jr_taREery_sKymhTFDS4aoQvlvNPbqvmIlFhl0gtGEmPYXF6CN2trjUFTqtTT1rhm70wdZ6CeqYYiy4UHKGMCuNSFfhqAnlCxxByMNim8QRDdnVe-wgOIizIqEYv0KDlMp4jWdw1SGuC6o3cdIdnJMvemHEqkSO2UKsp_JmXe_e24Mtj3W7rJA0HHhOqDyzjX2FmbT5l7PYiw_fNQA5MCLxHjmK2jAkswubGWTGLf-LGhPZfg-Omuv62VB6RA_WhdVMIBnnLkqcHz2iCRU55GOgOxJfsLb3l6wZxAsOBZExJdH8mtP8SvqwysYvRKYd0Af1HRM6TDopEBre09Bd7WPg9ga8qBijxhZTvDVRu42It3n2mSfYcVcq1wGcRYU_rZJcZK-CRRU2wGQhYq1w0tnpRCkwV4cREw6JhnZ4kO4igsFe-n8T_wcEnzds58qHaHsibulX6NKCjGoWs_4Naa91rHNuBc8RlnONASSMATzs4hIMn081cMya5rSbfTy9K0o-ys9yS4pIw6xqyREgQ0oljXjQLgxY7PaD0TInc_03sYc8LiMA5r3JujJ1AMI27MqD-i_EQqUosZEWhg0mGmqn3pn3OQirzqOFH2HF9lsO1hv45ZnyD7cLPgXqZE_Yz0vWu86rA6Rw2Zmc_fu3ItLCryrUhUtU0mKktVl9GEK2S__M5hqS1GvlAyT7UeCM71T8Pv1h6AvcI3JWFWLYz4KmcLp1UlhbzDd-ENT5E8rvBCi57GmtduMxuCMqfn6n2AEXG-nKL5jr82bzUb3D8XLcSrQQbir7C1RfFwB4vGw2me6I7ChrAlLzPcqurKZypCMEaKa3mLfIPUrcrulan5QZuV7Lq51NoWbWUCpuhrX_TWgVcl31pqVh2NYre-__rB1Otde2oJq8Aszhhn9EItsvCSCFF0LYolEGWNiBubxB26Nf05lMCyu7PPDIlzJF_3z4c7bJs8jh8RaNcpzLIvjuDXS8Tt8pwwfqX0zQIyYXep3EfFyiDcq1qAJOzO95ZZsXWUURrz0oTIaJ781sOeySaogrXhi25nxvHOhQyvZxiBYPSZvmmdDsxP2UJU9CT23T-ZUOkVXGl7PQ2lfpwA1E7rYOmcggXFznZcpLjJtIeLynhS7tAGa6B-ZzDS5I7Mlw9yQnBr-s5R0JIcOEURXwzu4n1Lkx0q3PDRvxMnjvMocJBh3rXZMy4LVgSl2DQQnsQogRvnrrBcw8eNieZY3GBrzBjI6_qaVVE1-BTOOwkcQcF7gCZmS7wMLIxP3Zbn1RZHjdLZP7PRNvPjSTiLBjf8NFnNQdjiEFDCbFrkGlJkvmoR9H2FRuTjymCYF82a3gtGj4UoaweJNe5BBkTRW28z6V3Wn0aKjC-5qsS6-3E5RaOVEwY1R7BgZD7bnwgn0-0-MnMSO82hbXqzHYynBP5ThSKGJKg9X_UhBxnmu9kchJ-B6_mnWJAZ4bDn14hClZCUQzm7ziZNMYNttM5QzAYYsVQZ8VhGwt2q7Vlm8gOKJKn9u9fd2lpvjPvPZIBdojFhNhHc8i8ieyZiQOfbfPq3Wn1grpZAAETf3LwvheNOxbM5Iy6jKVtS3xnYJdtr63v4TxwynRZJ0-_5Swqtdm-weCmJ31Ig-GUQjlKjmk_VAyjgmZo5kpQEBM4kSpaYtNDjPNUf8SNi1HxZjy5wmVcU6_WYxKMIN2qw4f7Pf_751z_c9v6ORavev5kiXT6bm_QCAk6K-iz1NFnZBuaAGRBP2pIR6n9LwSh_ykHBo8FE8JPhL9c0TLPrfIQP86YoK545u2b206VDXigHGPmdEAjnhDBLm7CVMc8zQmiEhO_OkVr5R52pms7VL8U6BRRFRlrkq0H9kmcno2J08x_BecvTxnaUvtHH41D7oEmwzCHtkuV4XsGftL4ywi747xw4nFF1duWxNoTR6PeUkQqyajM7krJOGsUt3NIoZsFb3kF8kZC60C5_4MC5Wm8_69QrJr70PuMJN-GBNaAcnFGKdLwBlNCta1CVowfXm68P8epqgZ3sA4ZVS4MfbJqUMFqWxj7wTdvzdL38CjE7Yo35H-b311abEv5RDvCkOkqvjxzE9T2H4Gr8zv-X8rpmzo5zq_5iO6btZyCxTF4gwrvl2XrqgkJ070dWzvqnRc5cDlew8MEr5yGpuElc8e11jul-vKkBHvku_rQ8gJBzMwg6UBYg-N8bG_VvPGdjAdiHEAt0_Ni_mUTILElBMrNakMIaOysaazCGt6-MZ9ztrR0Qz2EHyZkYS0XD2q--Qy3HZPUCrnmTy18y07w-3RyBViPsCJKt-WnuXOvkWOfTnuBA3w2YhUCFUa-Jrburu7OD3aHl53KA6nSBDG5cx7vJxRm2k1mJeSQTTnTEfYyQ2iXg0CGVnXqN8PI04FWWL29TaaU4d_GdjaqX7W3Q_H13MZzOkPwzLMvE-wJZcm374m8e3_T5icfX_GH-v_8H0BtPE5oLAAA="


    const models = window['powerbi-client'].models; 
    
        const myFilter = {
            $schema: "http://powerbi.com/product/schema#advanced",
            target: {
                table: "vwAUsageDetails",
                column: "CustomerName"
            },
            operator: "In",
            values: ["Venga"]
        }
    
    const config = {
      type: 'report',
      tokenType: models.TokenType.Embed,
      accessToken:embedToken,
      embedUrl: embedUrl,
      id: reportId,
     // filters: [myFilter],
      permissions: models.Permissions.Read,
      settings: {
          filterPaneEnabled: false,
          navContentPaneEnabled: true
      }  
      }
    
    // Get a reference to the embedded dashboard HTML element 
    // const reportContainer = $('#reportContainer')[0];
    // Embed the dashboard and display it within the div container. 
    // powerbi.embed(reportContainer, config)
  }

  
}
