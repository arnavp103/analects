<script lang="ts">
	let value = "";

	function submit() {
		console.log("submit", value);
	}

</script>



<div class="flex items-center">

	<form class="flex flex-row items-center justify-stretch w-full h-8 font"
		on:submit|preventDefault={submit}
	>

		<input type="text" class="box-border border-2 flex-grow border-black rounded-sm font-mono px-2 mx-2" bind:value={value} />
		<button type="submit"
		class="bg-slate-200 px-4 rounded-sm h-full">Submit</button>
	</form>
</div>