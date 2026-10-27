const p = (html) => `<p>${html}</p>`
const ol = (items) => `<ol>${items.map((item) => `<li>${item}</li>`).join('')}</ol>`
const ul = (items) => `<ul>${items.map((item) => `<li>${item}</li>`).join('')}</ul>`
const eq = (html) => `<p><strong>${html}</strong></p>`

export const MICRO_DECK_NAME = 'Microeconomic Theory: Exam Recipes'

export const MICRO_DECK = {
  name: MICRO_DECK_NAME,
  description: 'Recognize the question, pick the formula, then follow the steps.',
  emoji: '📈',
  color: '#EDE9FE',
}

export const MICRO_CARDS = [
  {
    tags: ['map'],
    front: p('What are the 6 methods behind most micro questions?'),
    back: ul([
      '<strong>Preferences:</strong> compare bundles, calculate MRS.',
      '<strong>Consumer optimum and welfare:</strong> set MRS = price ratio.',
      '<strong>Production and costs:</strong> derivatives, MRTS, MC, AC, AVC.',
      '<strong>Firm optimum and market power:</strong> set MR = MC.',
      '<strong>Uncertainty:</strong> probability-weighted utility.',
      '<strong>Exchange and games:</strong> equalize MRS, or find best responses.',
    ]),
  },
  {
    tags: ['preferences'],
    front: p('What is a bundle?'),
    back: p('A combination of goods.') + eq('A = (x<sub>A</sub>, y<sub>A</sub>)') + p('Example: (3, 5) means 3 units of x and 5 units of y.'),
  },
  {
    tags: ['preferences'],
    front: p('Completeness: what it means and how to check'),
    back: p('Any two bundles can be compared.') + p('For any A and B, either A is at least as good as B, or B is at least as good as A (or both).'),
  },
  {
    tags: ['preferences'],
    front: p('Transitivity: what it means and how to check'),
    back: p('Preferences are consistent.') + eq('If A ≽ B and B ≽ C, then A ≽ C.'),
  },
  {
    tags: ['preferences'],
    front: p('Continuity: what it means and how to check'),
    back: p('Preferences do not jump.') + p('A small change in the bundle should not cause a discontinuous change in preference.'),
  },
  {
    tags: ['preferences'],
    front: p('Monotonicity vs strict monotonicity'),
    back: ul([
      '<strong>Monotonicity:</strong> more goods cannot make you worse off. Utility is nondecreasing in both goods.',
      '<strong>Strict monotonicity:</strong> more of any good makes you strictly better off.',
      'For a differentiable utility function, positive marginal utilities establish strict monotonicity.',
    ]),
  },
  {
    tags: ['preferences'],
    front: p('Convexity of preferences: how to check'),
    back: p('Mixtures are at least as good as the extremes.') + p('Check whether upper contour sets are convex.'),
  },
  {
    tags: ['preferences'],
    front: p('Symmetry of preferences: how to check'),
    back: p('Swapping the quantities does not change the preference.') + eq('u(x, y) = u(y, x)'),
  },
  {
    tags: ['preferences'],
    front: p('Recipe: compare two bundles'),
    back: ol([
      'Substitute bundle A into u(x, y).',
      'Substitute bundle B into u(x, y).',
      'Compare the numbers. Higher utility is preferred.',
    ]) + p('Example: u = xy gives u(2, 5) = 10 and u(4, 3) = 12, so (4, 3) is preferred to (2, 5).'),
  },
  {
    tags: ['preferences'],
    front: p('Recipe: marginal utility'),
    back: eq('MU<sub>x</sub> = ∂u/∂x &nbsp;&nbsp; MU<sub>y</sub> = ∂u/∂y') + ol([
      'Take the partial derivative with respect to x.',
      'Take the partial derivative with respect to y.',
      'Divide them to get MRS.',
    ]),
  },
  {
    tags: ['preferences'],
    front: p('MRS: formula and meaning'),
    back: eq('MRS<sub>xy</sub> = MU<sub>x</sub> / MU<sub>y</sub>') + p('How much y the consumer will give up for one more unit of x, holding utility constant.') + p('The slope of an indifference curve is −MRS.'),
  },
  {
    tags: ['preferences'],
    front: p('Recognize the standard utility functions'),
    back: ul([
      '<strong>x<sup>a</sup> y<sup>1−a</sup>:</strong> Cobb-Douglas. Smooth, usually an interior optimum.',
      '<strong>ln x + ln y:</strong> log utility. Same preferences as xy.',
      '<strong>ax + by:</strong> perfect substitutes. Often a corner.',
      '<strong>min{ax, by}:</strong> perfect complements. Optimum at the kink.',
      '<strong>x + y:</strong> perfect substitutes with MRS = 1.',
      '<strong>x<sup>2</sup> + y<sup>2</sup>:</strong> convex utility, not convex preferences. Mixtures can be worse.',
    ]),
  },
  {
    tags: ['preferences'],
    front: p('Cobb-Douglas MRS shortcut'),
    back: p('For u = x<sup>a</sup> y<sup>1−a</sup>:') + eq('MRS = [a / (1 − a)] · (y / x)'),
  },
  {
    tags: ['preferences'],
    front: p('Log utility: marginal utilities and MRS'),
    back: p('u = ln x + ln y') + eq('MU<sub>x</sub> = 1/x &nbsp;&nbsp; MU<sub>y</sub> = 1/y') + eq('MRS = y / x'),
  },
  {
    tags: ['optimization'],
    front: p('Budget line: equation, slope, and intercepts'),
    back: eq('p<sub>x</sub> x + p<sub>y</sub> y = I') + ul([
      'Slope = −p<sub>x</sub> / p<sub>y</sub>',
      'x-intercept = I / p<sub>x</sub>',
      'y-intercept = I / p<sub>y</sub>',
    ]),
  },
  {
    tags: ['optimization'],
    front: p('Interior consumer optimum: the condition'),
    back: eq('MRS = p<sub>x</sub> / p<sub>y</sub>') + p('The indifference curve is tangent to the budget line.'),
  },
  {
    tags: ['optimization'],
    front: p('Recipe: find an interior optimal bundle'),
    back: ol([
      'Calculate MU<sub>x</sub> and MU<sub>y</sub>.',
      'Form MRS = MU<sub>x</sub> / MU<sub>y</sub>.',
      'Set MRS = p<sub>x</sub> / p<sub>y</sub>.',
      'Rearrange so one good is in terms of the other.',
      'Substitute into p<sub>x</sub> x + p<sub>y</sub> y = I.',
      'Solve for both quantities.',
      'If asked, substitute the bundle back into utility.',
    ]),
  },
  {
    tags: ['optimization'],
    front: p('Cobb-Douglas demand shortcut'),
    back: p('For u = x<sup>a</sup> y<sup>1−a</sup>, skip the derivatives.') + eq('x* = a I / p<sub>x</sub>') + eq('y* = (1 − a) I / p<sub>y</sub>') + p('Spend fraction a of income on x and fraction 1 − a on y.'),
  },
  {
    tags: ['optimization'],
    front: p('Log utility demand shortcut'),
    back: p('For u = ln x + ln y:') + eq('x* = I / (2 p<sub>x</sub>) &nbsp;&nbsp; y* = I / (2 p<sub>y</sub>)') + p('Spend half of income on each good.'),
  },
  {
    tags: ['optimization'],
    front: p('Recipe: perfect substitutes'),
    back: p('For u = ax + by, compare utility per dollar:') + eq('a / p<sub>x</sub> &nbsp; versus &nbsp; b / p<sub>y</sub>') + p('Buy only the good with more utility per dollar. If they are equal, every bundle on the budget line is optimal.'),
  },
  {
    tags: ['optimization'],
    front: p('Recipe: perfect complements'),
    back: p('For u = min{ax, by}, the optimum is at the kink.') + ol([
      'Set ax = by.',
      'Substitute into the budget.',
      'Solve for x and y.',
    ]),
  },
  {
    tags: ['demand'],
    front: p('What is a demand function?'),
    back: p('Optimal quantity written in terms of prices and income.') + p('Cobb-Douglas: x(p<sub>x</sub>, p<sub>y</sub>, I) = a I / p<sub>x</sub>.'),
  },
  {
    tags: ['demand'],
    front: p('Recipe: own-price elasticity'),
    back: eq('ε<sub>x, p<sub>x</sub></sub> = (∂x/∂p<sub>x</sub>) · (p<sub>x</sub> / x)') + ol([
      'Write demand x(p<sub>x</sub>).',
      'Differentiate with respect to p<sub>x</sub>.',
      'Multiply by p<sub>x</sub> / x.',
      'Simplify.',
    ]),
  },
  {
    tags: ['demand'],
    front: p('How to read an own-price elasticity'),
    back: ul([
      'ε = −1: unit elastic.',
      '−1 &lt; ε &lt; 0: inelastic.',
      'ε &lt; −1: elastic.',
      'ε = 0: perfectly inelastic.',
      'Cobb-Douglas demand x = a I / p<sub>x</sub> is always unit elastic: ε = −1.',
    ]),
  },
  {
    tags: ['demand'],
    front: p('Recipe: income elasticity, and what the sign means'),
    back: eq('ε<sub>x, I</sub> = (∂x/∂I) · (I / x)') + ul([
      'Positive: normal good.',
      'Negative: inferior good.',
      'Greater than 1: luxury, in the income-elasticity sense.',
      'Between 0 and 1: income-inelastic normal good.',
    ]),
  },
  {
    tags: ['demand'],
    front: p('Recipe: cross-price elasticity'),
    back: eq('ε<sub>x, p<sub>y</sub></sub> = (∂x/∂p<sub>y</sub>) · (p<sub>y</sub> / x)') + ul([
      'Positive: gross substitutes.',
      'Negative: gross complements.',
      'Zero: demand for x does not respond to p<sub>y</sub>.',
    ]),
  },
  {
    tags: ['welfare'],
    front: p('Recipe: change in consumer surplus when price rises'),
    back: eq('ΔCS = − ∫<sub>p<sub>0</sub></sub><sup>p<sub>1</sub></sup> x(p) dp') + ol([
      'Find demand x(p).',
      'Identify the old and new prices.',
      'Integrate demand between them.',
      'The minus sign makes ΔCS negative when price rises.',
    ]),
  },
  {
    tags: ['welfare'],
    front: p('Consumer surplus when demand is x(p) = 40/p'),
    back: eq('ΔCS = −40 ln(p<sub>1</sub> / p<sub>0</sub>)') + p('For a price increase, this number is negative.'),
  },
  {
    tags: ['welfare'],
    front: p('Consumer-surplus loss for linear demand'),
    back: p('The lost area is a trapezoid.') + eq('CS loss = [(q<sub>0</sub> + q<sub>1</sub>) / 2] · (p<sub>1</sub> − p<sub>0</sub>)'),
  },
  {
    tags: ['welfare'],
    front: p('Split a price change into substitution and income effects'),
    back: eq('Total effect = substitution effect + income effect') + ul([
      'A = original optimum. B = final optimum. D = Hicksian decomposition bundle.',
      'Substitution effect = x<sub>D</sub> − x<sub>A</sub>',
      'Income effect = x<sub>B</sub> − x<sub>D</sub>',
      'Total effect = x<sub>B</sub> − x<sub>A</sub>',
    ]) + p('Substitution: the good got relatively cheaper or more expensive. Income: purchasing power changed.'),
  },
  {
    tags: ['welfare'],
    front: p('Recipe: Hicksian decomposition bundle'),
    back: ol([
      'Find the original bundle A.',
      'Calculate original utility u<sub>A</sub>.',
      'Set MRS<sub>D</sub> equal to the new price ratio.',
      'Require u(x<sub>D</sub>, y<sub>D</sub>) = u<sub>A</sub>.',
      'Solve those two equations together.',
      'Then compute substitution and income effects.',
    ]),
  },
  {
    tags: ['welfare'],
    front: p('Normal, inferior, and Giffen goods after a price increase'),
    back: ul([
      '<strong>Normal:</strong> both the substitution and income effects reduce consumption of that good.',
      '<strong>Inferior:</strong> the income effect works in the opposite direction.',
      '<strong>Giffen:</strong> an inferior good whose income effect is large enough to outweigh the substitution effect, so quantity rises when its price rises.',
    ]),
  },
  {
    tags: ['welfare'],
    front: p('What question does compensating variation answer?'),
    back: p('After a price increase, how much money must we give the person to restore their original utility?'),
  },
  {
    tags: ['welfare'],
    front: p('Recipe: compensating variation'),
    back: ol([
      'Find the original bundle and original utility u<sub>0</sub>.',
      'Use the new prices.',
      'Set MRS equal to the new price ratio.',
      'Set utility equal to u<sub>0</sub> and solve for bundle D.',
      'Cost that bundle at the new prices: I<sub>D</sub> = p<sub>x</sub><sup>new</sup> x<sub>D</sub> + p<sub>y</sub><sup>new</sup> y<sub>D</sub>.',
    ]) + eq('CV = I<sub>D</sub> − I<sub>0</sub>') + p('For a price increase, this is the compensation paid afterward.'),
  },
  {
    tags: ['welfare'],
    front: p('What question does equivalent variation answer?'),
    back: p('Before a price increase, how much money could we take away to leave the person as badly off as they will be afterward?'),
  },
  {
    tags: ['welfare'],
    front: p('Recipe: equivalent variation'),
    back: ol([
      'Find the final bundle B and final utility u<sub>1</sub>.',
      'Use the old prices.',
      'Set MRS equal to the old price ratio.',
      'Set utility equal to u<sub>1</sub> and solve for bundle E.',
      'Cost that bundle at the old prices: I<sub>E</sub> = p<sub>x</sub><sup>old</sup> x<sub>E</sub> + p<sub>y</sub><sup>old</sup> y<sub>E</sub>.',
    ]) + eq('EV = I<sub>0</sub> − I<sub>E</sub>'),
  },
  {
    tags: ['welfare'],
    front: p('CV versus EV: what to memorize'),
    back: ul([
      '<strong>CV</strong> uses the new prices and targets original utility. It is compensation afterward.',
      '<strong>EV</strong> uses the old prices and targets final utility. It is the equivalent loss beforehand.',
    ]) + p('Expenditure function: e(p, u) is the minimum spend needed to reach utility u.') + eq('CV = e(p<sub>1</sub>, u<sub>0</sub>) − e(p<sub>0</sub>, u<sub>0</sub>)') + eq('EV = e(p<sub>1</sub>, u<sub>1</sub>) − e(p<sub>0</sub>, u<sub>1</sub>)') + p('For the practice log-utility case, CV is larger than the consumer-surplus loss, which is larger than EV.'),
  },
  {
    tags: ['production'],
    front: p('What is a production function?'),
    back: p('How much output can be made from inputs such as labor and capital.') + eq('q = f(L, K)'),
  },
  {
    tags: ['production'],
    front: p('Recipe: marginal products'),
    back: eq('MP<sub>L</sub> = ∂q/∂L &nbsp;&nbsp; MP<sub>K</sub> = ∂q/∂K') + ol([
      'Differentiate the production function with respect to labor.',
      'Differentiate with respect to capital.',
      'Plug in the given input quantities if the question asks for a number.',
    ]),
  },
  {
    tags: ['production'],
    front: p('Marginal products for q = L<sup>1/2</sup> K<sup>1/2</sup>'),
    back: eq('MP<sub>L</sub> = (1/2) √(K/L)') + eq('MP<sub>K</sub> = (1/2) √(L/K)'),
  },
  {
    tags: ['production'],
    front: p('Average product versus marginal product'),
    back: eq('AP<sub>L</sub> = q/L &nbsp;&nbsp; AP<sub>K</sub> = q/K') + p('Average product is output per unit of an input. Marginal product is the extra output from one more unit.'),
  },
  {
    tags: ['production'],
    front: p('MRTS: formula and meaning'),
    back: eq('MRTS = MP<sub>L</sub> / MP<sub>K</sub>') + p('How much capital the firm can give up for one more unit of labor while keeping output constant. It is the production-side version of MRS.') + p('For q = √(LK), MRTS = K/L.'),
  },
  {
    tags: ['production'],
    front: p('Recipe: returns to scale'),
    back: ol([
      'Replace L with tL and K with tK.',
      'Simplify f(tL, tK).',
      'Compare it with t · f(L, K).',
    ]) + ul([
      'Larger than t f: increasing returns to scale.',
      'Equal to t f: constant returns to scale.',
      'Smaller than t f: decreasing returns to scale.',
    ]),
  },
  {
    tags: ['production'],
    front: p('Returns to scale for Cobb-Douglas q = A L<sup>α</sup> K<sup>β</sup>'),
    back: eq('Look at α + β') + ul([
      'Greater than 1: increasing.',
      'Equal to 1: constant.',
      'Less than 1: decreasing.',
    ]) + p('Returns to scale move all inputs together. Diminishing marginal product moves only one input. They are not the same thing.'),
  },
  {
    tags: ['costs'],
    front: p('The cost-minimization problem'),
    back: p('Produce a target output at the lowest cost.') + eq('min wL + rK &nbsp; subject to &nbsp; f(L, K) = q̄') + p('w is the wage. r is the rental price of capital.'),
  },
  {
    tags: ['costs'],
    front: p('Interior cost minimum: the condition'),
    back: eq('MP<sub>L</sub> / w = MP<sub>K</sub> / r') + p('An extra dollar of each input must produce the same extra output.') + eq('Equivalently: MRTS = w / r'),
  },
  {
    tags: ['costs'],
    front: p('Recipe: cost minimization'),
    back: ol([
      'Find MP<sub>L</sub> and MP<sub>K</sub>.',
      'Set MP<sub>L</sub> / w = MP<sub>K</sub> / r.',
      'Rearrange into a relationship between L and K.',
      'Substitute that relationship into the production function.',
      'Set output equal to the target q̄.',
      'Solve for L and K.',
      'Total cost is wL + rK.',
    ]),
  },
  {
    tags: ['costs'],
    front: p('Recipe: a cap on labor, such as L ≤ 2000'),
    back: ol([
      'Solve the problem with no cap first.',
      'If L* is within the cap, use that solution.',
      'If L* exceeds the cap, set L = 2000.',
      'Solve f(2000, K) = q̄ for K.',
      'Calculate total cost.',
    ]) + p('At a binding cap for a standard Cobb-Douglas technology, you should find MP<sub>L</sub>/w &gt; MP<sub>K</sub>/r. The firm wants more labor and cannot buy it.'),
  },
  {
    tags: ['costs'],
    front: p('Recipe: add a third production method'),
    back: p('If artisans produce g(A) on top of f(L, K), total output is q = f(L, K) + g(A).') + ol([
      'Solve the original cost-minimization problem.',
      'Compute marginal product per dollar for every input.',
      'If the new method starts with a higher marginal product per dollar, shift some production toward it.',
      'At an interior optimum, equalize MP<sub>L</sub>/w = MP<sub>K</sub>/r = MP<sub>A</sub>/p<sub>A</sub>.',
      'Combine that with the output target.',
      'Solve for every input and then for cost.',
    ]),
  },
  {
    tags: ['costs'],
    front: p('Artisan marginal product'),
    back: p('If g(A) = A − A<sup>2</sup>/1000:') + eq('MP<sub>A</sub> = 1 − A/500') + p('If the artisan price is 1, marginal product per dollar is also 1 − A/500.'),
  },
  {
    tags: ['costs'],
    front: p('Cost definitions'),
    back: ul([
      'TC = C(q): total expenditure.',
      'FC: does not change with output.',
      'VC = TC − FC: does change with output.',
      'ATC = TC / q.',
      'AVC = VC / q.',
      'AFC = FC / q.',
      'MC = C′(q): cost of one more unit.',
    ]) + eq('ATC = AVC + AFC'),
  },
  {
    tags: ['costs'],
    front: p('Recipe: economies and diseconomies of scale'),
    back: p('Economies of scale: ATC falls as q rises. Diseconomies: ATC rises as q rises.') + ol([
      'Write ATC = C(q) / q.',
      'Differentiate ATC.',
      'Set ATC′(q) = 0 to find turning points.',
      'Check where ATC is falling and where it is rising.',
    ]) + p('At an interior minimum of ATC, MC = ATC. If MC is below ATC, ATC is falling. If MC is above ATC, ATC is rising.'),
  },
  {
    tags: ['costs'],
    front: p('Recipe: short-run shutdown price'),
    back: eq('p<sub>shutdown</sub> = minimum AVC') + ol([
      'Separate fixed and variable cost.',
      'Write AVC = VC / q.',
      'Differentiate AVC and set the derivative to 0.',
      'Confirm it is a minimum.',
      'Compare the market price with that minimum AVC.',
    ]) + ul([
      'p below min AVC: shut down in the short run.',
      'p equal to min AVC: indifferent between that output and shutting down.',
      'p above min AVC: producing can be right even if profit is negative.',
    ]),
  },
  {
    tags: ['costs'],
    front: p('Recipe: profit maximization for a price taker'),
    back: eq('π(q) = p q − C(q)') + eq('Interior condition: p = MC(q)') + ol([
      'Differentiate total cost to get MC.',
      'Set MC = p and solve for candidate quantities.',
      'Check which candidate is a maximum, not a minimum.',
      'Compare that profit with shutting down at q = 0.',
      'Profit is p q − C(q).',
    ]),
  },
  {
    tags: ['costs'],
    front: p('What happens if fixed cost rises by F?'),
    back: eq('C<sub>new</sub>(q) = C<sub>old</sub>(q) + F') + eq('MC<sub>new</sub> = MC<sub>old</sub>') + p('The best positive output does not change, as long as staying open still beats shutting down. Profit at that output falls by F.') + p('Exam trap: fixed cost changes profit. It does not change marginal cost.'),
  },
  {
    tags: ['monopoly'],
    front: p('Linear demand: total revenue and marginal revenue'),
    back: p('If p(q) = a − b q:') + eq('TR = a q − b q<sup>2</sup>') + eq('MR = a − 2 b q') + p('MR has the same intercept as demand and twice as steep a slope.'),
  },
  {
    tags: ['monopoly'],
    front: p('Recipe: monopoly optimum'),
    back: ol([
      'Write inverse demand p(q).',
      'TR = p(q) · q.',
      'Differentiate TR to get MR.',
      'Differentiate cost to get MC.',
      'Set MR = MC and solve for q*.',
      'Put q* into the demand curve, not into MR, to get p*.',
      'Profit is p* q* − C(q*).',
    ]),
  },
  {
    tags: ['monopoly'],
    front: p('Monopoly markup formula'),
    back: eq('(p − MC) / p = −1 / ε') + p('This is the Lerner index. ε is the own-price elasticity of demand. More elastic demand means a smaller optimal percentage markup.'),
  },
  {
    tags: ['discrimination'],
    front: p('Recipe: different prices in two markets'),
    back: ol([
      'Write each inverse demand curve.',
      'Find MR in each market.',
      'Set each market’s MR equal to MC.',
      'Solve for each quantity.',
      'Put each quantity into its own demand curve to get its price.',
      'Add the profits, and subtract a shared fixed cost only once.',
    ]) + p('If MC depends on total output: MR<sub>L</sub>(q<sub>L</sub>) = MR<sub>P</sub>(q<sub>P</sub>) = MC(q<sub>L</sub> + q<sub>P</sub>).'),
  },
  {
    tags: ['discrimination'],
    front: p('Recipe: one common price across two markets'),
    back: ol([
      'Turn each inverse demand into quantity as a function of price.',
      'Add quantities horizontally: Q(p) = q<sub>L</sub>(p) + q<sub>P</sub>(p).',
      'Note the price where each market starts buying.',
      'Write aggregate demand in pieces.',
      'Turn each piece back into inverse demand and find its MR.',
      'Set MR = MC on each piece.',
      'Keep a candidate only if its price sits in the piece you assumed.',
      'Compare profits, including relevant boundary points.',
    ]) + p('Do not add the two inverse demand equations.'),
  },
  {
    tags: ['discrimination'],
    front: p('Percentage profit lost'),
    back: eq('% loss = [(π<sub>old</sub> − π<sub>new</sub>) / π<sub>old</sub>] × 100'),
  },
  {
    tags: ['discrimination'],
    front: p('Recipe: menu pricing and versioning'),
    back: p('The seller does not see each customer’s willingness to pay, so it offers options and lets customers self-select. That is different from charging an observed group, such as a city, its own price.') + ol([
      'Find each customer’s value for each option.',
      'Subtract the price to get that customer’s surplus.',
      'See which option each customer picks.',
      'Check that each intended type prefers the option designed for them.',
      'Calculate seller revenue and cost.',
      'Compare profits across menus that actually work.',
    ]),
  },
  {
    tags: ['risk'],
    front: p('Expected value'),
    back: eq('EV = Σ p<sub>i</sub> I<sub>i</sub>') + p('It is the probability-weighted average of the money outcomes.') + p('A 50% chance of 100 and a 50% chance of 200 has EV = 150.'),
  },
  {
    tags: ['risk'],
    front: p('Recipe: expected utility'),
    back: eq('EU = Σ p<sub>i</sub> u(I<sub>i</sub>)') + ol([
      'List every outcome.',
      'Find final wealth in each outcome.',
      'Apply u to each final wealth.',
      'Multiply by the probability.',
      'Add.',
    ]) + p('Exam trap: for nonlinear utility, u(EV) is not equal to EU.'),
  },
  {
    tags: ['risk'],
    front: p('Risk attitude from the shape of utility'),
    back: ul([
      'Concave, u″(I) &lt; 0: risk averse. Examples: √I and ln I.',
      'Linear, u″(I) = 0: risk neutral. Example: u(I) = I.',
      'Convex, u″(I) &gt; 0: risk loving. Example: I<sup>2</sup> for positive wealth.',
    ]),
  },
  {
    tags: ['risk'],
    front: p('Recipe: certainty equivalent'),
    back: eq('u(CE) = EU') + ol([
      'Calculate expected utility.',
      'Set u(CE) equal to that number.',
      'Apply the inverse utility function.',
    ]) + p('If u(I) = √I, then CE = (EU)<sup>2</sup>. If u(I) = ln I, then CE = e<sup>EU</sup>.'),
  },
  {
    tags: ['risk'],
    front: p('Risk premium'),
    back: eq('RP = EV − CE') + p('How much expected wealth the person would give up to remove the risk. For a risk-averse person, the risk premium is at least zero.'),
  },
  {
    tags: ['insurance'],
    front: p('Wealth with and without a loss, given insurance'),
    back: p('W is initial wealth, p is the probability of loss, D is the loss, a is coverage, and c is the premium per dollar of coverage.') + eq('No loss: W<sub>N</sub> = W − c a') + eq('Loss: W<sub>L</sub> = W − D + (1 − c) a'),
  },
  {
    tags: ['insurance'],
    front: p('Recipe: optimal insurance coverage'),
    back: eq('EU(a) = (1 − p) u(W − c a) + p u(W − D + (1 − c) a)') + eq('p (1 − c) u′(W<sub>L</sub>) = (1 − p) c u′(W<sub>N</sub>)') + ol([
      'Write wealth in the no-loss state and the loss state.',
      'Write expected utility in coverage a.',
      'Differentiate with respect to a.',
      'Set the derivative to 0 and solve for a.',
      'Require 0 ≤ a ≤ D. If the solution is outside that interval, compare the boundaries.',
    ]),
  },
  {
    tags: ['insurance'],
    front: p('How to choose between insurance offers'),
    back: ol([
      'For each policy, write wealth in every outcome.',
      'Calculate expected utility.',
      'Pick the policy with higher expected utility.',
    ]) + p('Do not automatically pick the cheaper premium.'),
  },
  {
    tags: ['insurance'],
    front: p('Insurer’s expected profit'),
    back: eq('E[π] = (c − p) a') + p('The firm charges c a and pays a with probability p. If c = p, the policy is actuarially fair before administrative costs.'),
  },
  {
    tags: ['exchange'],
    front: p('Pareto efficiency'),
    back: p('An allocation is Pareto efficient if you cannot make one person better off without making someone else worse off.') + p('Efficient does not mean fair or equal.'),
  },
  {
    tags: ['exchange'],
    front: p('Feasible allocations when each good has total T'),
    back: eq('x<sub>1</sub> + x<sub>2</sub> = T &nbsp;&nbsp; y<sub>1</sub> + y<sub>2</sub> = T') + eq('x<sub>2</sub> = T − x<sub>1</sub> &nbsp;&nbsp; y<sub>2</sub> = T − y<sub>1</sub>'),
  },
  {
    tags: ['exchange'],
    front: p('Recipe: interior Pareto efficient allocations'),
    back: eq('MRS<sub>1</sub> = MRS<sub>2</sub>') + ol([
      'Calculate each person’s MRS.',
      'Set them equal.',
      'Substitute the resource constraints.',
      'Solve for y<sub>1</sub> in terms of x<sub>1</sub>.',
      'State the feasible range.',
      'Check the boundaries separately.',
    ]) + p('This is for two people with smooth, strictly monotonic, strictly convex preferences.'),
  },
  {
    tags: ['exchange'],
    front: p('Edgeworth box and the contract curve'),
    back: ul([
      'Width is total x. Height is total y.',
      'Person 1’s origin is the bottom left. Person 2’s origin is the top right.',
      'Every point in the box is a feasible allocation.',
      'The contract curve is the set of Pareto efficient allocations.',
      'At an interior point on it, the indifference curves are tangent.',
    ]),
  },
  {
    tags: ['exchange'],
    front: p('Contract curve when Cobb-Douglas tastes differ'),
    back: p('u<sub>1</sub> = x<sub>1</sub><sup>a</sup> y<sub>1</sub><sup>1−a</sup> and u<sub>2</sub> = x<sub>2</sub><sup>b</sup> y<sub>2</sub><sup>1−b</sup>.') + ul([
      'If a = b and the totals of the two goods are equal, the contract curve is the 45-degree line.',
      'If a &gt; b, person 1 values x relatively more, so efficient allocations give person 1 more x relative to y.',
      'If a &lt; b, the tilt reverses.',
    ]),
  },
  {
    tags: ['games'],
    front: p('Three parts of a game'),
    back: p('Players, strategies, and payoffs.'),
  },
  {
    tags: ['games'],
    front: p('Recipe: best responses'),
    back: p('A best response is the action with the highest payoff given the other player’s action.') + ol([
      'Fix player 2’s strategy.',
      'Compare player 1’s payoffs across actions.',
      'Mark the highest one.',
      'Repeat for every strategy of player 2.',
      'Do the same for player 2.',
    ]),
  },
  {
    tags: ['games'],
    front: p('Dominant strategy'),
    back: p('A strategy that is a best response no matter what the other player does.') + p('If one action always gives a strictly higher payoff, it is strictly dominant.'),
  },
  {
    tags: ['games'],
    front: p('Recipe: pure-strategy Nash equilibrium'),
    back: p('A Nash equilibrium is a strategy pair where each player’s strategy is a best response to the other.') + ol([
      'Find player 1’s best responses.',
      'Find player 2’s best responses.',
      'Mark cells where both are playing a best response.',
      'Those cells are the pure-strategy Nash equilibria.',
    ]) + p('A Nash equilibrium does not have to be Pareto efficient.'),
  },
]
