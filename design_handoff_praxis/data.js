// Mock data — the AI-generated "practice test" content shown in the prototype.
// In the real product, this would come back from the model after ingestion.

window.PRAXIS_DATA = {
  files: [
    { name: "ml_lecture_notes_w08.pdf",     size: "2.4 MB",  type: "PDF",   status: "analyzed",   timestamp: "2026-05-26 14:22" },
    { name: "linear_algebra_review.pdf",    size: "842 KB",  type: "PDF",   status: "analyzed",   timestamp: "2026-05-26 15:05" },
    { name: "probability_chapter_03.docx",  size: "131 KB",  type: "DOCX",  status: "processing", timestamp: "2026-05-26 15:18" },
    { name: "midterm_2025_solutions.pdf",   size: "1.1 MB",  type: "PDF",   status: "queued",     timestamp: "2026-05-26 15:31" },
  ],
  test: {
    module: "Neural Networks II",
    sessionId: "482-BETA",
    questions: [
      {
        id: 1,
        topic: "Backpropagation",
        title: "Which statement best describes the vanishing gradient problem in deep recurrent networks?",
        body: [
          "Consider a recurrent neural network with hidden state h_t and a loss function L evaluated at the final time step. During backpropagation through time, the gradient of L with respect to weights at early time steps depends on a product of Jacobian matrices spanning many time steps."
        ],
        code: "dL/dW = Σ ( dL/dh_T · ∏ (dh_t / dh_{t-1}) · dh_k/dW )\n#         ↑ this product grows or shrinks geometrically",
        choices: [
          "Gradients explode whenever the activation function is unbounded, regardless of weight magnitude.",
          "Gradients vanish when the spectral radius of the recurrent weight matrix is less than one and activations saturate.",
          "Vanishing gradients are caused exclusively by the choice of optimizer, not by the network architecture.",
          "Gradients vanish only when the input sequence length is shorter than the hidden dimension.",
        ],
        correct: 1,
        explanation: "The product of Jacobians decays toward zero when ‖W_h‖ < 1 and activation derivatives are small (saturated tanh/sigmoid). Both conditions compound multiplicatively across time steps, so signal from early tokens cannot reach the loss."
      },
      {
        id: 2,
        topic: "Optimization",
        title: "Why does Adam converge faster than vanilla SGD on most non-convex problems?",
        body: [
          "Adam maintains per-parameter estimates of the first and second moments of the gradient and uses them to adapt the effective learning rate independently for each weight."
        ],
        choices: [
          "It guarantees convergence to a global minimum even in non-convex landscapes.",
          "It eliminates the need for a learning rate hyperparameter entirely.",
          "Adaptive per-parameter step sizes let it traverse poorly-conditioned curvature without manual tuning.",
          "It applies second-order Newton updates exactly using the full Hessian.",
        ],
        correct: 2,
        explanation: "Adam approximates curvature information cheaply using running averages of squared gradients, effectively rescaling each parameter's step size. It does not compute the Hessian and offers no global-minimum guarantee."
      },
      {
        id: 3,
        topic: "Regularization",
        title: "What is the primary effect of dropout during training?",
        body: [
          "Dropout randomly zeros a fraction p of activations during each forward pass and rescales the remaining activations by 1/(1−p)."
        ],
        choices: [
          "It guarantees that every neuron is used during every training step.",
          "It reduces co-adaptation of features and approximates an ensemble of subnetworks.",
          "It increases the effective capacity of the model by adding parameters.",
          "It changes the loss function to L2 regularization on the weights.",
        ],
        correct: 1,
        explanation: "Each forward pass uses a different random subnetwork. Averaging predictions across these subnetworks at test time (via the scale) approximates ensembling, which dampens over-reliance on any single feature path."
      },
      {
        id: 4,
        topic: "Attention",
        title: "In scaled dot-product attention, why is the dot product divided by √d_k?",
        body: [
          "The attention operation computes softmax(QKᵀ / √d_k) V, where d_k is the dimension of each query/key vector."
        ],
        choices: [
          "To make the result invariant to the choice of softmax temperature.",
          "To match the variance of QKᵀ to unit variance and keep softmax gradients well-behaved.",
          "To enforce orthogonality between attention heads.",
          "To compensate for floating-point precision loss in fp16.",
        ],
        correct: 1,
        explanation: "If queries and keys are roughly unit-variance, their dot product has variance d_k. Without scaling, large d_k pushes softmax into saturation, killing gradients. Dividing by √d_k restores unit variance and stable gradients."
      },
      {
        id: 5,
        topic: "Loss Functions",
        title: "When is cross-entropy preferred over mean squared error for classification?",
        body: [
          "Both losses can technically be applied to classification outputs, but they exhibit very different gradient behavior near saturation."
        ],
        choices: [
          "Cross-entropy is always preferred because it produces smaller numerical values.",
          "MSE is preferred when there are more than two classes.",
          "Cross-entropy provides stronger gradients when predictions are very wrong, accelerating learning.",
          "MSE is preferred because it has a closed-form solution for neural networks.",
        ],
        correct: 2,
        explanation: "With sigmoid/softmax outputs, MSE gradients vanish when the model is confidently wrong because the activation derivative is near zero. Cross-entropy cancels that derivative term, leaving a clean residual that scales with the error magnitude."
      },
      {
        id: 6,
        topic: "Architectures",
        title: "What problem do residual (skip) connections in ResNets primarily solve?",
        body: [
          "Adding the input of a block back onto its output — h = F(x) + x — became standard practice after ResNets demonstrated that very deep networks could be trained reliably."
        ],
        choices: [
          "They eliminate the need for batch normalization.",
          "They allow gradients to flow directly through identity paths, easing optimization of very deep networks.",
          "They reduce the total number of parameters by reusing the input.",
          "They guarantee that every layer learns a useful transformation.",
        ],
        correct: 1,
        explanation: "The identity shortcut means the gradient of the loss with respect to the input of a block includes a +1 term, preventing gradients from vanishing as depth grows. Each block now only has to learn a residual correction over its input."
      },
    ]
  }
};
