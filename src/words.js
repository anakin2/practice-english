const groups = [
['日常生活','Daily life', `morning|ˈmɔːrnɪŋ|早晨
breakfast|ˈbrekfəst|早餐
lunch|lʌntʃ|午餐
dinner|ˈdɪnər|晚餐
family|ˈfæməli|家庭
parent|ˈperənt|父親或母親
brother|ˈbrʌðər|兄弟
sister|ˈsɪstər|姊妹
kitchen|ˈkɪtʃən|廚房
bedroom|ˈbedruːm|臥室
window|ˈwɪndoʊ|窗戶
mirror|ˈmɪrər|鏡子
clothes|kloʊðz|衣服
shower|ˈʃaʊər|淋浴
brush|brʌʃ|刷；刷子
clean|kliːn|清潔的；打掃
sleep|sliːp|睡覺
wake|weɪk|醒來
busy|ˈbɪzi|忙碌的
early|ˈɜːrli|早的；提早`],
['校園學習','School & learning', `school|skuːl|學校
student|ˈstuːdənt|學生
teacher|ˈtiːtʃər|老師
classroom|ˈklæsruːm|教室
subject|ˈsʌbdʒɪkt|科目
science|ˈsaɪəns|自然科學
history|ˈhɪstəri|歷史
language|ˈlæŋɡwɪdʒ|語言
homework|ˈhoʊmwɜːrk|家庭作業
notebook|ˈnoʊtbʊk|筆記本
library|ˈlaɪbreri|圖書館
question|ˈkwestʃən|問題
answer|ˈænsər|答案；回答
practice|ˈpræktɪs|練習
learn|lɜːrn|學習
remember|rɪˈmembər|記得
understand|ˌʌndərˈstænd|了解
important|ɪmˈpɔːrtənt|重要的
difficult|ˈdɪfɪkəlt|困難的
easy|ˈiːzi|容易的`],
['飲食購物','Food & shopping', `apple|ˈæpəl|蘋果
banana|bəˈnænə|香蕉
vegetable|ˈvedʒtəbəl|蔬菜
fruit|fruːt|水果
bread|bred|麵包
rice|raɪs|米飯
chicken|ˈtʃɪkɪn|雞；雞肉
milk|mɪlk|牛奶
water|ˈwɔːtər|水
juice|dʒuːs|果汁
hungry|ˈhʌŋɡri|飢餓的
thirsty|ˈθɜːrsti|口渴的
delicious|dɪˈlɪʃəs|美味的
restaurant|ˈrestərɑːnt|餐廳
market|ˈmɑːrkɪt|市場
price|praɪs|價格
money|ˈmʌni|錢
cheap|tʃiːp|便宜的
expensive|ɪkˈspensɪv|昂貴的
buy|baɪ|購買`],
['自然旅行','Nature & travel', `weather|ˈweðər|天氣
sunny|ˈsʌni|晴朗的
cloudy|ˈklaʊdi|多雲的
rain|reɪn|雨；下雨
wind|wɪnd|風
season|ˈsiːzən|季節
spring|sprɪŋ|春天
summer|ˈsʌmər|夏天
autumn|ˈɔːtəm|秋天
winter|ˈwɪntər|冬天
mountain|ˈmaʊntən|山
river|ˈrɪvər|河流
beach|biːtʃ|海灘
island|ˈaɪlənd|島嶼
country|ˈkʌntri|國家
city|ˈsɪti|城市
station|ˈsteɪʃən|車站
airport|ˈerpɔːrt|機場
ticket|ˈtɪkɪt|票
travel|ˈtrævəl|旅行`],
['心情與行動','Feelings & actions', `happy|ˈhæpi|快樂的
sad|sæd|傷心的
angry|ˈæŋɡri|生氣的
excited|ɪkˈsaɪtɪd|興奮的
tired|ˈtaɪərd|疲倦的
nervous|ˈnɜːrvəs|緊張的
friendly|ˈfrendli|友善的
kind|kaɪnd|仁慈的
brave|breɪv|勇敢的
careful|ˈkerfəl|小心的
help|help|幫助
share|ʃer|分享
listen|ˈlɪsən|聆聽
speak|spiːk|說話
read|riːd|閱讀（原形）
write|raɪt|寫
choose|tʃuːz|選擇
believe|bɪˈliːv|相信
hope|hoʊp|希望
enjoy|ɪnˈdʒɔɪ|享受；喜愛`]
]
export const categories = groups.map(([name, english]) => ({ name, english }))
export const words = groups.flatMap(([category, , rows]) => rows.split('\n').map(row => {
  const [word, ipa, meaning] = row.split('|')
  return { word, ipa, meaning, category }
})).map((entry, index) => ({ ...entry, id: index + 1 }))
