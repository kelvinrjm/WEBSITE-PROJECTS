document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('reportForm');
  const submittedDateInput = document.getElementById('submittedDate');
  const popup = document.getElementById('successPopup');
  const submitButton = form.querySelector('button[type="submit"]');
  const imageInput = document.getElementById('imageUpload');
  const imagePreview = document.getElementById('imagePreview');
  const imagePreviewText = document.getElementById('imagePreviewText');
  const imagePreviewBox = document.getElementById('imagePreviewBox');

  if (!form || !submittedDateInput || !popup || !submitButton) {
    return;
  }

  const setCurrentDate = () => {
    const today = new Date();
    submittedDateInput.value = today.toISOString().split('T')[0];
  };

  const clearErrors = () => {
    form.querySelectorAll('input, textarea').forEach((field) => {
      field.classList.remove('is-invalid');
      const errorEl = form.querySelector(`[data-error-for="${field.id}"]`);
      if (errorEl) {
        errorEl.textContent = '';
      }
    });
  };

  const showError = (field, message) => {
    field.classList.add('is-invalid');
    const errorEl = form.querySelector(`[data-error-for="${field.id}"]`);
    if (errorEl) {
      errorEl.textContent = message;
    }
  };

  const validateForm = () => {
    clearErrors();
    let isValid = true;

    const placeField = document.getElementById('place');
    const classField = document.getElementById('className');
    const titleField = document.getElementById('problemTitle');
    const descriptionField = document.getElementById('problemDescription');
    const solutionField = document.getElementById('suggestedSolution');

    if (!placeField.value.trim()) {
      showError(placeField, 'Place is required.');
      isValid = false;
    } else if (placeField.value.trim().length < 3) {
      showError(placeField, 'Place must be at least 3 characters.');
      isValid = false;
    }

    if (!classField.value.trim()) {
      showError(classField, 'Class is required.');
      isValid = false;
    } else if (classField.value.trim().length < 2) {
      showError(classField, 'Class must be at least 2 characters.');
      isValid = false;
    }

    if (!titleField.value.trim()) {
      showError(titleField, 'Problem title is required.');
      isValid = false;
    } else if (titleField.value.trim().length < 5) {
      showError(titleField, 'Problem title must be at least 5 characters.');
      isValid = false;
    }

    if (!descriptionField.value.trim()) {
      showError(descriptionField, 'Problem description is required.');
      isValid = false;
    } else if (descriptionField.value.trim().length < 30) {
      showError(descriptionField, 'Problem description must be at least 30 characters.');
      isValid = false;
    }

    if (!solutionField.value.trim()) {
      showError(solutionField, 'Suggested solution is required.');
      isValid = false;
    } else if (solutionField.value.trim().length < 15) {
      showError(solutionField, 'Suggested solution must be at least 15 characters.');
      isValid = false;
    }

    return isValid;
  };

  const toggleLoading = (loading) => {
    submitButton.disabled = loading;
    submitButton.innerHTML = loading
      ? '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...'
      : '<i class="fa-solid fa-paper-plane"></i> Submit Report';
  };

  const showPopup = () => {
    popup.classList.remove('hidden');
    window.setTimeout(() => {
      popup.classList.add('hidden');
    }, 2800);
  };

  const resetForm = () => {
    form.reset();
    setCurrentDate();
    clearErrors();
    if (imagePreview && imagePreviewText && imagePreviewBox) {
      imagePreview.style.display = 'none';
      imagePreview.removeAttribute('src');
      imagePreviewText.textContent = 'No image selected';
      imagePreviewBox.style.borderStyle = 'dashed';
    }
  };

  const previewSelectedImage = () => {
    if (!imageInput || !imagePreview || !imagePreviewText || !imagePreviewBox) {
      return;
    }

    const file = imageInput.files[0];

    if (!file) {
      imagePreview.style.display = 'none';
      imagePreview.removeAttribute('src');
      imagePreviewText.textContent = 'No image selected';
      imagePreviewBox.style.borderStyle = 'dashed';
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    imagePreview.src = objectUrl;
    imagePreview.style.display = 'block';
    imagePreviewText.textContent = file.name;
    imagePreviewBox.style.borderStyle = 'solid';
  };

  const uploadImage = async (file) => {
    if (!file) {
      return null;
    }

    const filePath = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const { data, error } = await window.supabase.storage
      .from('campus-uploads')
      .upload(filePath, file, { cacheControl: '3600', upsert: false });

    if (error) {
      throw error;
    }

    const { data: publicData } = window.supabase.storage
      .from('campus-uploads')
      .getPublicUrl(data.path);

    return publicData.publicUrl;
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    toggleLoading(true);

    try {
      if (!window.supabase || !window.supabase.from || !window.supabase.storage) {
        throw new Error('Supabase client is not configured.');
      }

      const file = imageInput && imageInput.files ? imageInput.files[0] : null;
      const imageUrl = file ? await uploadImage(file) : null;

      const payload = {
        place: document.getElementById('place').value.trim(),
        class_name: document.getElementById('className').value.trim(),
        problem_title: document.getElementById('problemTitle').value.trim(),
        problem_description: document.getElementById('problemDescription').value.trim(),
        suggested_solution: document.getElementById('suggestedSolution').value.trim(),
        image_url: imageUrl,
        submitted_date: submittedDateInput.value,
      };

      const { error } = await window.supabase.from('campus_reports').insert([payload]);

      if (error) {
        throw error;
      }

      showPopup();
      resetForm();
    } catch (error) {
      alert('Submission failed. Please check your Supabase table, storage bucket, and configuration.');
    } finally {
      toggleLoading(false);
    }
  });

  if (imageInput) {
    imageInput.addEventListener('change', previewSelectedImage);
  }

  setCurrentDate();
});
