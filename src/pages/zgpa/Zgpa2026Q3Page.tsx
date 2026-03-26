import { Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { CartoonPageShell } from '../../components/cartoon/CartoonLayout'

const { Paragraph, Text, Title } = Typography

type TableRow = Record<string, string> & { key: string }

const introList = [
  '寿险负债端持续修复，NBV 仍在高增长',
  '集团资产端稳健，但低利率仍压制长期估值中枢',
  '当前估值不贵，股息率提供较强持有支撑',
]

const keyData2024 = [
  '集团 EV：14226.02 亿元',
  '寿险及健康险 EV：8350.93 亿元',
  '归母营运利润（OPAT）：1218.62 亿元，同比 +9.1%',
  '归母净利润：1266.07 亿元，同比 +47.8%',
  '寿险及健康险 NBV：可比口径同比 +28.8%',
  '全年分红：2.55 元/股，同比 +5%',
  '集团核心偿付能力充足率：165.22%',
  '集团综合偿付能力充足率：204.06%',
]

const keyData2025 = [
  '寿险及健康险 NBV：同比 +46.2%',
  '保险资金投资组合规模：超过 6.4 万亿元',
  '保险资金投资组合未年化综合投资收益率：5.4%',
  '保险资金投资组合未年化净投资收益率：2.8%',
]

const liabilityLists = {
  signal: ['新单质量在变好', '渠道效率在提高', '产品结构在优化', '负债端不是“冲规模”，而是在“提价值”'],
  channel: ['代理人渠道 NBV +26.5%', '代理人人均 NBV +43.3%', '银保渠道 NBV +62.7%'],
  channelMeaning: ['个险质量改善', '银保高质量放量', '多渠道结构更均衡'],
}

const assetLists = {
  investment: ['综合投资收益率 5.8%', '10 年平均综合投资收益率 5.1%'],
  pressure: ['底仓收益率压力仍然存在', '再投资收益率并不轻松', '利率环境仍决定保险股估值中枢'],
  bank: ['底盘更厚，利润来源更多元', '估值更复杂，市场更容易给控股折价'],
}

const capitalLists = {
  meaning: ['分红更可靠', '新业务扩张更有余地', '市场波动时安全垫更厚'],
}

const supplementList = [
  'P/EV 是平安的主锚。',
  'P/B 主要看下行保护。',
  '股息率 决定持有体验和估值下限。',
  'A/H 折价 更像质量和市场认可度的辅助信号。',
]

const valuationPositionList = [
  '集团 EV：14226.02 亿元',
  '归母净资产：9286 亿元',
  '总股本：182.10 亿股',
  '每股分红：2.55 元',
]

const valuationResultList = ['市值：10343 亿元', 'P/EV：0.73x', 'P/B：1.11x', '股息率：4.5% 左右']

const compareList = [
  '股价：取 2026-03-26 A 股价格',
  'EV / 归母净资产 / 分红：取 2024 年报口径',
  'P/EV、P/B、股息率：按上述口径粗算',
]

const valuePriceList = ['负债端质量', '资产端稳健性', '分红', 'A/H 定价一致性', '综合金融底盘']

const bullishList = ['NBV 高增长', '渠道改善持续兑现', '分红稳定', '资本充足', '质量在险企中仍属前列']
const bearishList = ['低利率压制资产端回报和 EV 弹性', '综合金融结构带来长期控股折价', '市场不愿意给保险股太高估值中枢']

const qualityList = ['估值有底', '分红有支撑', '质量有保障', '弹性受利率约束']
const styleList = ['负债端质量', '分红稳定', '估值安全边际', '长期持有体验']
const styleAltList = ['极致低估', '高弹性估值修复', '更强赔率博弈']

const valuationReferenceColumns: ColumnsType<TableRow> = [
  { title: '指标', dataIndex: 'metric', key: 'metric' },
  { title: '偏低估区间', dataIndex: 'low', key: 'low' },
  { title: '合理区间', dataIndex: 'fair', key: 'fair' },
  { title: '偏高估区间', dataIndex: 'high', key: 'high' },
  { title: '说明', dataIndex: 'note', key: 'note' },
]

const valuationReferenceData: TableRow[] = [
  {
    key: 'pev',
    metric: 'P/EV',
    low: '<0.70x',
    fair: '0.70x–0.90x',
    high: '>0.90x',
    note: '寿险/综合险企最核心指标，反映市场对存量价值和新增价值的定价',
  },
  {
    key: 'pb',
    metric: 'P/B',
    low: '<1.00x',
    fair: '1.00x–1.30x',
    high: '>1.30x',
    note: '更适合看安全边际，不是主估值逻辑',
  },
  {
    key: 'yield',
    metric: '股息率',
    low: '<3.0%',
    fair: '3.0%–4.5%',
    high: '>4.5%',
    note: '对保险股来说，股息率高通常意味着价格更有支撑；若高股息同时基本面稳，往往对应较好配置价值',
  },
  {
    key: 'ah',
    metric: 'A/H 折价',
    low: '>-30%',
    fair: '-30% 至 -15%',
    high: '>-15%（折价更小）',
    note: '折价越小，通常说明跨市场认可度越高；但不是独立估值逻辑',
  },
]

const currentValuationColumns: ColumnsType<TableRow> = [
  { title: '指标', dataIndex: 'metric', key: 'metric' },
  { title: '当前值', dataIndex: 'current', key: 'current' },
  { title: '所处区间', dataIndex: 'range', key: 'range' },
  { title: '结论', dataIndex: 'conclusion', key: 'conclusion' },
]

const currentValuationData: TableRow[] = [
  { key: 'pev', metric: 'P/EV', current: '0.73x', range: '合理区间下沿', conclusion: '不贵，接近“合理偏低”' },
  { key: 'pb', metric: 'P/B', current: '1.11x', range: '合理区间', conclusion: '有安全边际，但不算极端便宜' },
  { key: 'yield', metric: '股息率', current: '约4.5%', range: '合理区间上沿 / 高吸引力边缘', conclusion: '对长期持有较友好' },
  { key: 'ah', metric: 'A/H 折价', current: '-9.6%', range: '折价较小', conclusion: '跨市场认可度高' },
]

const peersColumns: ColumnsType<TableRow> = [
  { title: '公司', dataIndex: 'company', key: 'company' },
  { title: 'A股价', dataIndex: 'price', key: 'price' },
  { title: '市值(亿元)', dataIndex: 'marketCap', key: 'marketCap' },
  { title: 'EV(亿元)', dataIndex: 'ev', key: 'ev' },
  { title: 'P/EV', dataIndex: 'pev', key: 'pev' },
  { title: '归母净资产(亿元)', dataIndex: 'netAsset', key: 'netAsset' },
  { title: 'P/B', dataIndex: 'pb', key: 'pb' },
  { title: '股息率', dataIndex: 'yield', key: 'yield' },
  { title: 'A/H折价', dataIndex: 'discount', key: 'discount' },
]

const peersData: TableRow[] = [
  { key: 'pa', company: '中国平安', price: '56.80', marketCap: '10343', ev: '14226', pev: '0.73x', netAsset: '9286', pb: '1.11x', yield: '4.5%', discount: '-9.6%' },
  { key: 'cpic', company: '中国太保', price: '37.09', marketCap: '3568', ev: '5621', pev: '0.64x', netAsset: '2914', pb: '1.22x', yield: '2.9%', discount: '-24.3%' },
  { key: 'life', company: '中国人寿', price: '37.74', marketCap: '10667', ev: '14052', pev: '0.76x', netAsset: '5097', pb: '2.09x', yield: '1.7%', discount: '-41.4%' },
  { key: 'nci', company: '新华保险', price: '63.75', marketCap: '1989', ev: '2584', pev: '0.77x', netAsset: '962', pb: '2.07x', yield: '4.0%', discount: '-35.2%' },
  { key: 'picc', company: '中国人保*', price: '7.76', marketCap: '3432', ev: '1197', pev: '2.87x', netAsset: '2687', pb: '1.28x', yield: '2.3%', discount: '-33.5%' },
]

const lifeOpsColumns: ColumnsType<TableRow> = [
  { title: '指标', dataIndex: 'metric', key: 'metric' },
  { title: '2024', dataIndex: 'value2024', key: 'value2024' },
  { title: '2025前三季度', dataIndex: 'value2025', key: 'value2025' },
  { title: '观察', dataIndex: 'note', key: 'note' },
]

const lifeOpsData: TableRow[] = [
  { key: 'nbv', metric: '寿险及健康险 NBV 增速', value2024: '+28.8%', value2025: '+46.2%', note: '负债端继续修复，新增价值创造强' },
  { key: 'agent', metric: '代理人渠道 NBV 增速', value2024: '+26.5%', value2025: '-', note: '个险质量改善已兑现' },
  { key: 'perAgent', metric: '代理人人均 NBV 增速', value2024: '+43.3%', value2025: '-', note: '代理人效率提升明显' },
  { key: 'bank', metric: '银保渠道 NBV 增速', value2024: '+62.7%', value2025: '高增长延续', note: '银保不只是放量，更在提质' },
  { key: 'service', metric: '享有健康养老服务权益客户对寿险 NBV 贡献', value2024: '约 70%', value2025: '近 70%', note: '服务生态开始进入经营层面' },
]

const assetOpsColumns: ColumnsType<TableRow> = [
  { title: '指标', dataIndex: 'metric', key: 'metric' },
  { title: '2024', dataIndex: 'value2024', key: 'value2024' },
  { title: '2025前三季度/上半年', dataIndex: 'value2025', key: 'value2025' },
  { title: '观察', dataIndex: 'note', key: 'note' },
]

const assetOpsData: TableRow[] = [
  { key: 'roi', metric: '综合投资收益率', value2024: '5.8%', value2025: '未年化 5.4%', note: '投资能力合格，表现稳健' },
  { key: 'tenYear', metric: '10年平均综合投资收益率', value2024: '5.1%', value2025: '-', note: '长期资金运用能力过关' },
  { key: 'net', metric: '净投资收益率', value2024: '-', value2025: '未年化 2.8%', note: '低利率压力仍在' },
  { key: 'scale', metric: '保险资金投资组合规模', value2024: '-', value2025: '超过 6.4万亿元', note: '资产规模大，底盘厚' },
  { key: 'core', metric: '集团核心偿付能力充足率', value2024: '165.22%', value2025: '-', note: '资本安全垫较厚' },
  { key: 'total', metric: '集团综合偿付能力充足率', value2024: '204.06%', value2025: '-', note: '资本不构成当前约束' },
]

const shareholderColumns: ColumnsType<TableRow> = [
  { title: '指标', dataIndex: 'metric', key: 'metric' },
  { title: '2024', dataIndex: 'value2024', key: 'value2024' },
  { title: '观察', dataIndex: 'note', key: 'note' },
]

const shareholderData: TableRow[] = [
  { key: 'opat', metric: '归母营运利润（OPAT）', value2024: '1218.62 亿元', note: '看底盘更合适' },
  { key: 'profit', metric: '归母净利润', value2024: '1266.07 亿元', note: '受市场波动影响更大' },
  { key: 'dividend', metric: '每股分红', value2024: '2.55 元', note: '股东回报稳定' },
  { key: 'growth', metric: '分红增速', value2024: '+5%', note: '分红能力稳健' },
  { key: 'yield', metric: '当前股息率（按 56.80 元）', value2024: '约4.5%', note: '对长期持有有支撑' },
]

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="zgpa-list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

function DataBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="zgpa-data-block">
      <h3>{title}</h3>
      <BulletList items={items} />
    </section>
  )
}

export function Zgpa2026Q3Page() {
  return (
    <CartoonPageShell>
      <div className="zgpa-report-shell">
        <header className="zgpa-masthead">
          <div className="zgpa-masthead-copy">
            <Tag color="gold">zgpa</Tag>
            <Tag color="cyan">2026-q3</Tag>
            <Title level={1}>中国平安研究笔记</Title>
            <Title level={2}>核心结论</Title>
            <Paragraph>中国平安的投资逻辑，核心不在短期利润，而在三点：</Paragraph>
            <ol className="zgpa-ordered-list">
              {introList.map((item) => (
                <li key={item}>
                  <Text strong>{item}</Text>
                </li>
              ))}
            </ol>
          </div>
          <blockquote className="zgpa-quote-card">
            平安的本质是“高质量负债端驱动的综合金融平台”，适合用 Group EV 定价，而不是用 PE。
          </blockquote>
        </header>

        <section className="zgpa-band">
          <div className="zgpa-section-head">
            <Title level={2}>一、最关键的数据</Title>
          </div>
          <div className="zgpa-two-up">
            <DataBlock title="2024 年" items={keyData2024} />
            <DataBlock title="2025 年前三季度跟踪" items={keyData2025} />
          </div>
        </section>

        <section className="zgpa-article">
          <div className="zgpa-section-head">
            <Title level={2}>二、平安真正值钱的地方：负债端</Title>
          </div>
          <Paragraph>
            平安最重要的不是“今年赚了多少”，而是<Text strong>负债端是不是还在持续创造高质量新价值</Text>。这一点目前是成立的。
          </Paragraph>
          <div className="zgpa-section-grid">
            <article className="zgpa-note-card">
              <h3>1）NBV 仍是最强信号</h3>
              <Paragraph>2024 年 NBV 可比口径 +28.8%，2025 年前三季度继续 +46.2%。</Paragraph>
              <Paragraph>这说明平安的寿险改革已经转化成持续的新业务价值提升。</Paragraph>
              <Paragraph>这组数据背后的含义很明确：</Paragraph>
              <BulletList items={liabilityLists.signal} />
            </article>
            <article className="zgpa-note-card">
              <h3>2）渠道改善是真实发生的</h3>
              <Paragraph>2024 年：</Paragraph>
              <BulletList items={liabilityLists.channel} />
              <Paragraph>这说明平安不是依赖单一渠道，而是：</Paragraph>
              <BulletList items={liabilityLists.channelMeaning} />
              <Paragraph>这会直接提升负债端韧性。</Paragraph>
            </article>
            <article className="zgpa-note-card zgpa-note-card-quote">
              <h3>3）服务生态开始真正进入估值逻辑</h3>
              <Paragraph>
                平安的医疗、养老、综合金融协同，如果已经明显改善客户经营和 NBV 结构，那它就不再只是故事，而是开始进入经营层面。
              </Paragraph>
              <Paragraph>我对这一点的判断是：</Paragraph>
              <blockquote>平安最值得给溢价的，不是资产端收益率，而是它比多数同行更接近“客户经营型险企”。</blockquote>
            </article>
          </div>
        </section>

        <section className="zgpa-article">
          <div className="zgpa-section-head">
            <Title level={2}>三、资产端不是惊喜项，但足够稳</Title>
          </div>
          <Paragraph>平安资产端的特点不是高弹性，而是稳健。</Paragraph>
          <div className="zgpa-section-grid">
            <article className="zgpa-note-card">
              <h3>1）投资能力合格，长期表现不差</h3>
              <Paragraph>2024 年：</Paragraph>
              <BulletList items={assetLists.investment} />
              <Paragraph>这意味着平安不是靠某一年市场大涨才显得好看，长期资金运用能力是过关的。</Paragraph>
            </article>
            <article className="zgpa-note-card">
              <h3>2）但低利率仍是估值压制项</h3>
              <Paragraph>2025 年前三季度未年化净投资收益率 2.8%，这个数本身就说明问题：</Paragraph>
              <BulletList items={assetLists.pressure} />
              <Paragraph>所以平安资产端虽然稳，但很难支撑“高估值想象力”。</Paragraph>
              <Paragraph>它提供的是底盘稳定性，不是估值爆发力。</Paragraph>
            </article>
            <article className="zgpa-note-card zgpa-note-card-quote">
              <h3>3）银行业务增加底盘，也增加折价</h3>
              <Paragraph>平安不是纯保险公司，这意味着两件事同时成立：</Paragraph>
              <BulletList items={assetLists.bank} />
              <Paragraph>所以平安长期估值上不去，不一定是保险业务不行，而是：</Paragraph>
              <blockquote>综合金融平台的复杂性，天然会压低市场愿意给的倍数。</blockquote>
            </article>
          </div>
        </section>

        <section className="zgpa-article">
          <div className="zgpa-section-head">
            <Title level={2}>四、资本和分红决定了它“能不能拿得住”</Title>
          </div>
          <div className="zgpa-two-up">
            <article className="zgpa-note-card">
              <h3>1）资本不紧</h3>
              <Paragraph>2024 年集团核心/综合偿付能力充足率分别为 165.22% / 204.06%。</Paragraph>
              <Paragraph>这说明平安不是那种“看起来增长很好，但资本已经绷紧”的公司。</Paragraph>
              <Paragraph>资本不紧的意义很直接：</Paragraph>
              <BulletList items={capitalLists.meaning} />
            </article>
            <article className="zgpa-note-card zgpa-note-card-quote">
              <h3>2）分红是平安估值下限的重要来源</h3>
              <Paragraph>2024 年股息 2.55 元/股，同比增长 5%。</Paragraph>
              <Paragraph>平安这种公司，分红意义很大，因为保险股价值兑现往往比较慢。</Paragraph>
              <Paragraph>换句话说：</Paragraph>
              <blockquote>平安不是只能靠估值修复赚钱，它本身就提供持续现金回报。</blockquote>
            </article>
          </div>
        </section>

        <section className="zgpa-article">
          <div className="zgpa-section-head">
            <Title level={2}>五、估值：先给标准区间，再看平安处在什么位置</Title>
          </div>

          <article className="zgpa-table-section">
            <h3>1）保险股常用估值指标的参考范围</h3>
            <Paragraph>下面这几个区间，不是绝对规则，而是更适合 A/H 上市大型保险股的经验参考。</Paragraph>
            <Table className="zgpa-table" rowKey="key" columns={valuationReferenceColumns} dataSource={valuationReferenceData} pagination={false} scroll={{ x: 900 }} />
            <Paragraph>补充说明：</Paragraph>
            <BulletList items={supplementList} />
          </article>

          <article className="zgpa-table-section">
            <h3>2）平安自己的估值位置</h3>
            <Paragraph>以 2026-03-26 A 股收盘价 56.80 元 估算，结合 2024 年年报口径：</Paragraph>
            <BulletList items={valuationPositionList} />
            <Paragraph>可得到平安当前大致估值：</Paragraph>
            <BulletList items={valuationResultList} />
            <Paragraph>把它放回上面的标准区间里：</Paragraph>
            <Table className="zgpa-table" rowKey="key" columns={currentValuationColumns} dataSource={currentValuationData} pagination={false} />
            <Paragraph>这组数说明两件事：</Paragraph>
            <Paragraph>第一，平安并不贵。</Paragraph>
            <Paragraph>第二，平安也不是深度错杀。</Paragraph>
            <Paragraph>所以平安当前更像：</Paragraph>
            <blockquote className="zgpa-inline-quote">质量最强，但价格只是合理偏低，不是极端便宜。</blockquote>
          </article>

          <article className="zgpa-table-section">
            <h3>3）和同业放在一起看</h3>
            <Paragraph>以下采用统一思路做近似比较：</Paragraph>
            <BulletList items={compareList} />
            <Table className="zgpa-table" rowKey="key" columns={peersColumns} dataSource={peersData} pagination={false} scroll={{ x: 1200 }} />
            <Paragraph>
              * 人保的 EV 口径与寿险主导型公司可比性较弱，P/EV 仅供参考，其估值更应结合财险业务特征、P/B 和股息率理解。
            </Paragraph>
          </article>

          <article className="zgpa-note-card">
            <h3>4）这张表真正说明什么</h3>
            <Title level={4}>平安不是最便宜的</Title>
            <Paragraph>如果只看 P/EV，太保比平安更便宜。</Paragraph>
            <Paragraph>太保 0.64x EV，平安 0.73x EV。</Paragraph>
            <Paragraph>这意味着：</Paragraph>
            <blockquote>如果你的目标是“赔率优先”，太保往往比平安更有吸引力。</blockquote>

            <Title level={4}>平安的“贵”主要贵在质量，而不是泡沫</Title>
            <Paragraph>虽然平安比太保贵，但它并没有贵到离谱。</Paragraph>
            <Paragraph>和国寿、新华相比，平安有两个明显优势：</Paragraph>
            <BulletList items={['P/B 更低：平安 1.11x，国寿和新华都在 2x 左右', '股息率更高或更均衡：平安 4.5%，明显好于国寿，也不输新华太多']} />

            <Title level={4}>平安的性价比体现在“质量/价格比”</Title>
            <Paragraph>如果只追求最低倍数，平安不是第一。</Paragraph>
            <Paragraph>但如果把几个维度放在一起看：</Paragraph>
            <BulletList items={valuePriceList} />
            <Paragraph>那么平安的估值其实是合理的。</Paragraph>
            <Paragraph>它并不是“便宜”，而是：</Paragraph>
            <blockquote>用不算贵的价格，买到行业里最均衡的一只。</blockquote>
          </article>
        </section>

        <section className="zgpa-article">
          <div className="zgpa-section-head">
            <Title level={2}>六、细分经营指标表</Title>
          </div>
          <article className="zgpa-table-section">
            <h3>1）寿险与价值创造指标</h3>
            <Table className="zgpa-table" rowKey="key" columns={lifeOpsColumns} dataSource={lifeOpsData} pagination={false} scroll={{ x: 820 }} />
          </article>
          <article className="zgpa-table-section">
            <h3>2）资产端与资本指标</h3>
            <Table className="zgpa-table" rowKey="key" columns={assetOpsColumns} dataSource={assetOpsData} pagination={false} scroll={{ x: 860 }} />
          </article>
          <article className="zgpa-table-section">
            <h3>3）利润与股东回报指标</h3>
            <Table className="zgpa-table" rowKey="key" columns={shareholderColumns} dataSource={shareholderData} pagination={false} scroll={{ x: 680 }} />
          </article>
        </section>

        <section className="zgpa-article">
          <div className="zgpa-section-head">
            <Title level={2}>七、核心矛盾</Title>
          </div>
          <Paragraph>平安现在的核心矛盾，其实很清楚：</Paragraph>
          <div className="zgpa-two-up">
            <article className="zgpa-note-card">
              <h3>利多</h3>
              <BulletList items={bullishList} />
            </article>
            <article className="zgpa-note-card">
              <h3>利空</h3>
              <BulletList items={bearishList} />
            </article>
          </div>
          <Paragraph>所以平安经常会出现一种状态：</Paragraph>
          <blockquote className="zgpa-inline-quote">公司很好，但估值弹性一般。</blockquote>
          <Paragraph>这也是为什么它通常更适合长期配置，而不是短期追高。</Paragraph>
        </section>

        <section className="zgpa-article">
          <div className="zgpa-section-head">
            <Title level={2}>八、最终判断</Title>
          </div>
          <Paragraph>我对平安的最终判断是：</Paragraph>
          <div className="zgpa-two-up">
            <article className="zgpa-note-card">
              <h3>从公司质量看</h3>
              <Paragraph>平安仍然是头部险企里综合质地最强的一只之一。</Paragraph>
              <Paragraph>最重要的原因是：负债端质量强，且改善还在继续。</Paragraph>
            </article>
            <article className="zgpa-note-card">
              <h3>从估值看</h3>
              <Paragraph>平安不算深度错杀，但也不贵。</Paragraph>
              <Paragraph>它更像一只：</Paragraph>
              <BulletList items={qualityList} />
              <Paragraph>的长期配置型保险股。</Paragraph>
            </article>
          </div>
          <article className="zgpa-note-card">
            <h3>从投资取向看</h3>
            <Paragraph>如果追求：</Paragraph>
            <BulletList items={styleList} />
            <Paragraph>那么平安通常值得优先看。</Paragraph>
            <Paragraph>如果追求：</Paragraph>
            <BulletList items={styleAltList} />
            <Paragraph>那平安未必是最猛的那只。</Paragraph>
          </article>
        </section>

        <section className="zgpa-closing">
          <Title level={2}>一句话结论</Title>
          <blockquote>平安不是最便宜的保险股，但通常是最适合长期资金持有的高质量保险股。</blockquote>
        </section>
      </div>
    </CartoonPageShell>
  )
}
